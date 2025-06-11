from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import scipy
import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')

try:
    vectorizer = joblib.load(os.path.join(MODEL_DIR, 'vectorizer.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    combined_recom_features = joblib.load(os.path.join(MODEL_DIR, 'combined_features.pkl'))
    gunung = joblib.load(os.path.join(MODEL_DIR, 'gunung_data.pkl'))
except Exception as e:
    raise RuntimeError(f"Gagal load model/data: {e}")

app = FastAPI(title="API Rekomendasi Gunung")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "API Rekomendasi Gunung aktif"
    }

class InputData(BaseModel):
    lokasi: str
    ketinggian: int

# Fungsi rekomendasi
def rekomendasikan_gunung(input_lokasi, input_ketinggian, top_n=5, similarity_threshold=0.3):
    # Validasi input kosong
    if not isinstance(input_lokasi, str):
        raise HTTPException(status_code=400, detail="Input lokasi harus berupa teks.")
    if input_lokasi.isnumeric():
        raise HTTPException(status_code=400, detail="Input lokasi tidak boleh hanya berisi angka.")
    if not isinstance(input_ketinggian, (int, float)):
        raise HTTPException(status_code=400, detail="Input ketinggian harus berupa angka.")
    if not input_lokasi or input_ketinggian is None:
        raise HTTPException(status_code=400, detail="Harus mengisi semua kolom: lokasi dan ketinggian.")

    try:
        # Proses rekomendasi
        input_lokasi_vec = vectorizer.transform([input_lokasi])
        input_numerik_df = pd.DataFrame([[input_ketinggian]], columns=['Ketinggian (dpl)'])
        input_numerik = scaler.transform(input_numerik_df)
        input_combined = scipy.sparse.hstack([input_lokasi_vec, input_numerik])

        similarity_scores = cosine_similarity(input_combined, combined_recom_features).flatten()

        filter_akses = gunung['Akses'] == 'Buka'
        qualified_indices = [
            i for i, score in enumerate(similarity_scores)
            if score >= similarity_threshold and filter_akses[i]
        ]

    except Exception as e:
            raise HTTPException(status_code=500, detail=f"Terjadi error internal: {str(e)}")

    # Urutkan dan ambil terbaik
    final_indices = sorted(qualified_indices,
                             key=lambda i: similarity_scores[i],
                             reverse=True)[:top_n]

    # Tampilkan jumlah hasil yang valid
    if len(final_indices) < top_n:
            print(f"ℹ Hanya ditemukan {len(final_indices)} rekomendasi yang memenuhi kriteria (gunung buka).")

    return gunung.iloc[final_indices][['Nama', 'Provinsi', 'Ketinggian (dpl)', 'Akses']]

# Endpoint
@app.post("/rekomendasi")
def rekomendasi_post(data: InputData):
    hasil = rekomendasikan_gunung(data.lokasi, data.ketinggian, top_n=5)
    if hasil is None or hasil.empty:
        return {"message": "⚠ Tidak ada gunung yang cocok ditemukan."}
    
    hasil = hasil.astype(object)
    return {"rekomendasi": hasil.to_dict(orient="records")}