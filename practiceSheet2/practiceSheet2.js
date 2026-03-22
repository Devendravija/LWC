import { LightningElement, track } from 'lwc';

export default class PracticeSheet2 extends LightningElement {
    data = [
    {
        "categories": [
            {
                "id": 1,
                "name": "Electronics",
                "products": [
                    {
                        "id": 101,
                        "name": "Smartphone",
                        "description": "Latest model smartphone with a 6.5-inch display.",
                        "price": 699,
                        "stockStatus": "In Stock",
                        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
                        "rating": 5,
                        "reviews": [
                            {
                                "user": "Rahul Sharma",
                                "rating": 5,
                                "comment": "Amazing phone, great value for money!"
                            }
                        ]
                    },
                    {
                        "id": 102,
                        "name": "Laptop",
                        "description": "A high-performance laptop with Intel i7 processor.",
                        "price": 999,
                        "stockStatus": "Out of Stock",
                        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
                        "rating": 3,
                        "reviews": [
                            {
                                "user": "Priya Verma",
                                "rating": 3,
                                "comment": "Decent laptop but a bit overpriced."
                            }
                        ]
                    }
                ]
            },
            {
                "id": 2,
                "name": "Clothing",
                "products": [
                    {
                        "id": 201,
                        "name": "T-shirt",
                        "description": "Comfortable cotton t-shirt available in various colors.",
                        "price": 25,
                        "stockStatus": "In Stock",
                        "image": "https://images.unsplash.com/photo-1520975918318-3e3c3f4a1c8b",
                        "rating": 3,
                        "reviews": [
                            {
                                "user": "Ankit Mehra",
                                "rating": 3,
                                "comment": "Good fit, but color faded after one wash."
                            }
                        ]
                    }
                ]
            },
            {
                "id": 3,
                "name": "Home Appliances",
                "products": [
                    {
                        "id": 301,
                        "name": "Air Conditioner",
                        "description": "Energy-efficient AC with smart controls.",
                        "price": 499,
                        "stockStatus": "In Stock",
                        "image": "https://images.unsplash.com/photo-1598300056393-4a3a3f6d6f9c",
                        "rating": 4,
                        "reviews": [
                            {
                                "user": "Sneha Iyer",
                                "rating": 4,
                                "comment": "Cools the room quickly and operates quietly."
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

    get optionsCategory() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Clothing', value: 'Clothing' },
            { label: 'Home Appliances', value: 'Home Appliances' }
        ];
    }

    get optionsPrice() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Low to High', value: 'Low' },
            { label: 'High to Low', value: 'High' }
        ];
    }

    get optionsRating() {
        return [
            { label: 'All', value: 'All' },
            { label: 'Low to High', value: 'Low' },
            { label: 'High to Low', value: 'High' }
        ];
    }

    valueCategory = 'All';
    valuePrice = 'All';
    valueRating = 'All';

    @track filteredProducts = [];

    connectedCallback() {
        this.handleClick();
    }

    // Flatten products
    get allProducts() {
        let products = [];
        this.data[0].categories.forEach(category => {
            category.products.forEach(product => {
                products.push({
                    ...product,
                    categoryName: category.name
                });
            });
        });
        return products;
    }

    handleChange(event) {
        const field = event.target.label;
        const value = event.detail.value;

        if (field === 'Category') {
            this.valueCategory = value;
        } else if (field === 'Sort by Price') {
            this.valuePrice = value;
        } else if (field === 'Sort by Rating') {
            this.valueRating = value;
        }

    }

    handleClick() {
        let filteredData = this.allProducts;

        if (this.valueCategory !== 'All') {
            filteredData = filteredData.filter(
                product => product.categoryName === this.valueCategory
            );
        }

        if (this.valuePrice === 'Low') {
            filteredData.sort((a, b) => a.price - b.price);
        } else if (this.valuePrice === 'High') {
            filteredData.sort((a, b) => b.price - a.price);
        }

        if (this.valueRating === 'Low') {
            filteredData.sort((a, b) => a.rating - b.rating);
        } else if (this.valueRating === 'High') {
            filteredData.sort((a, b) => b.rating - a.rating);
        }

        this.filteredProducts = filteredData;
    }
}