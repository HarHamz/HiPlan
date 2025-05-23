export class Mountain {
    constructor(id, name, location, altitude, image) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.altitude = altitude;
        this.image = image;
    }
}

export class MountainModel {
    constructor() {
        this.mountains = [
            new Mountain(1, 'Gunung Cartenz', 'Jawa Barat', '2.800 mdpl', 'cartenz.jpg'),
            new Mountain(2, 'Gunung Bromo', 'Jawa Timur', '2.329 mdpl', 'cartenz.jpg'),
            new Mountain(3, 'Gunung Prau', 'Jawa Tengah', '2.565 mdpl', 'cartenz.jpg'),
            new Mountain(4, 'Gunung Andong', 'Jawa Tengah', '1.726 mdpl', 'cartenz.jpg')
        ];
    }

    getAllMountains() {
        return this.mountains;
    }

    searchMountains(query) {
        const searchTerm = query.toLowerCase();
        return this.mountains.filter(mountain => 
            mountain.name.toLowerCase().includes(searchTerm) ||
            mountain.location.toLowerCase().includes(searchTerm)
        );
    }
}
