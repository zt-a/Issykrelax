from __future__ import annotations

import asyncio
import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.core.security import hash_password
from app.infrastructure.database.models.amenity import AmenityModel, PropertyAmenityModel
from app.infrastructure.database.models.category import CategoryModel
from app.infrastructure.database.models.city import CityModel
from app.infrastructure.database.models.owner_profile import OwnerProfileModel
from app.infrastructure.database.models.property import PropertyMediaModel, PropertyModel
from app.infrastructure.database.models.user import UserModel
from app.infrastructure.database.models.wallet import WalletModel


async def _check_exists(session: AsyncSession, model: type, slug: str) -> bool:
    result = await session.execute(select(model).where(model.slug == slug))
    return result.scalar_one_or_none() is not None


async def seed() -> None:
    async with async_session_factory() as session:
        existing = await session.execute(select(UserModel).where(UserModel.email == "admin@issykrelax.kg"))
        if existing.scalar_one_or_none():
            print("Seed data already exists, skipping.")
            return

        # Admin
        admin = UserModel(
            id=uuid.uuid4(),
            email="admin@issykrelax.kg",
            password_hash=hash_password("admin123"),
            full_name="Admin",
            is_active=True,
            is_verified=True,
            is_superuser=True,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        session.add(admin)

        # Cities
        cities_data = [
            ("Бостери", "bosteri", 100),
            ("Чолпон-Ата", "cholpon-ata", 95),
            ("Тамчы", "tamchy", 80),
            ("Корумду", "korumdu", 60),
            ("Балыкчы", "balykchy", 50),
            ("Кара-Ой", "kara-oy", 70),
        ]
        cities = []
        for name, slug, popularity in cities_data:
            if not await _check_exists(session, CityModel, slug):
                city = CityModel(
                    id=uuid.uuid4(),
                    name=name,
                    slug=slug,
                    popularity_score=popularity,
                    is_active=True,
                )
                session.add(city)
                cities.append(city)
            else:
                result = await session.execute(select(CityModel).where(CityModel.slug == slug))
                cities.append(result.scalar_one())

        # Categories
        categories_data = [
            ("Коттедж", "cottage", "Отдельный дом для отдыха", 1),
            ("Отель", "hotel", "Гостиница с номерами", 2),
            ("Гостевой дом", "guesthouse", "Гостевой дом с услугами", 3),
            ("Юрта", "yurt", "Традиционное жильё", 4),
            ("Тур", "tour", "Организованные экскурсии и туры", 5),
        ]
        categories = []
        for name, slug, desc, sort in categories_data:
            if not await _check_exists(session, CategoryModel, slug):
                cat = CategoryModel(
                    id=uuid.uuid4(),
                    name=name,
                    slug=slug,
                    description=desc,
                    sort_order=sort,
                )
                session.add(cat)
                categories.append(cat)
            else:
                result = await session.execute(select(CategoryModel).where(CategoryModel.slug == slug))
                categories.append(result.scalar_one())

        # Amenities
        amenities_data = [
            ("WiFi", "wifi"),
            ("Парковка", "parking"),
            ("Пляж", "beach"),
            ("Бассейн", "pool"),
            ("Барбекю", "barbecue"),
            ("Кухня", "kitchen"),
            ("Стиральная машина", "washing_machine"),
            ("Кондиционер", "air_conditioner"),
            ("Сауна", "sauna"),
            ("Детская кровать", "baby_bed"),
            ("Домашние животные", "pets"),
            ("Спортзал", "gym"),
            ("SPA", "spa"),
            ("Трансфер", "transfer"),
            ("Завтрак включён", "breakfast"),
        ]
        for name, slug in amenities_data:
            if not await _check_exists(session, AmenityModel, slug):
                amenity = AmenityModel(
                    id=uuid.uuid4(),
                    name=name,
                    slug=slug,
                )
                session.add(amenity)

        # Test owner
        owner = UserModel(
            id=uuid.uuid4(),
            email="owner@issykrelax.kg",
            password_hash=hash_password("owner123"),
            full_name="Тестовый Владелец",
            phone="+996 700 111 222",
            is_active=True,
            is_verified=True,
            is_superuser=False,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        session.add(owner)

        owner_profile = OwnerProfileModel(
            id=uuid.uuid4(),
            user_id=owner.id,
            is_approved=True,
            business_phone="+996 700 111 222",
        )
        session.add(owner_profile)

        wallet = WalletModel(
            id=uuid.uuid4(),
            owner_id=owner.id,
            available_balance=0,
            pending_balance=0,
        )
        session.add(wallet)

        # Properties
        now = datetime.now()
        properties_data = [
            {
                "title": "Уютный коттедж на берегу Иссык-Куля",
                "description": "Прекрасный коттедж с видом на озеро, собственный пляж и зона барбекю. 3 спальни, гостиная с камином, полностью оборудованная кухня. Идеально подходит для семейного отдыха или компании друзей.",
                "cat_idx": 0,
                "city_idx": 0,
                "price": 8500,
                "guests": 8,
                "bedrooms": 3,
                "beds": 5,
                "bathrooms": 2,
                "amenities": ["wifi", "parking", "beach", "barbecue", "kitchen", "air_conditioner"],
                "images": [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
                ],
            },
            {
                "title": "Гостевой дом «Айнура»",
                "description": "Уютный гостевой дом в центре Чолпон-Аты. Рядом рестораны, магазины и пляж. Завтрак включён. Приветливые хозяева и домашняя атмосфера.",
                "cat_idx": 2,
                "city_idx": 1,
                "price": 3500,
                "guests": 4,
                "bedrooms": 2,
                "beds": 3,
                "bathrooms": 1,
                "amenities": ["wifi", "parking", "breakfast", "kitchen", "transfer"],
                "images": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
                ],
            },
            {
                "title": "Юрт-кемп «Көчмөн»",
                "description": "Аутентичный юрточный лагерь прямо на берегу озера. 5 юрт, общая столовая, баня, вечерние программы с национальной музыкой. Незабываемый опыт!",
                "cat_idx": 3,
                "city_idx": 2,
                "price": 5000,
                "guests": 6,
                "bedrooms": 1,
                "beds": 6,
                "bathrooms": 1,
                "amenities": ["beach", "parking", "barbecue", "sauna", "transfer"],
                "images": [
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&h=600&fit=crop",
                ],
            },
            {
                "title": "Отель «Royal Beach»",
                "description": "Современный отель с собственным пляжем, бассейном и SPA-центром. Ресторан, бар, фитнес-зал. Всё включено.",
                "cat_idx": 1,
                "city_idx": 0,
                "price": 12000,
                "guests": 2,
                "bedrooms": 1,
                "beds": 1,
                "bathrooms": 1,
                "amenities": ["wifi", "parking", "beach", "pool", "air_conditioner", "sauna", "gym", "spa"],
                "images": [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
                ],
            },
            {
                "title": "Коттедж с сауной у озера",
                "description": "Двухэтажный коттедж с панорамными окнами, сауной и выходом к озеру. Современный ремонт, камин, терраса с мангалом.",
                "cat_idx": 0,
                "city_idx": 4,
                "price": 9500,
                "guests": 10,
                "bedrooms": 4,
                "beds": 6,
                "bathrooms": 3,
                "amenities": ["wifi", "parking", "beach", "sauna", "barbecue", "kitchen", "washing_machine", "pets"],
                "images": [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
                    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
                ],
            },
            {
                "title": "Бюджетный гостевой дом",
                "description": "Недорогой, но чистый и уютный гостевой дом. Отлично подходит для бюджетных путешественников. Есть общая кухня и зона отдыха.",
                "cat_idx": 2,
                "city_idx": 5,
                "price": 1500,
                "guests": 3,
                "bedrooms": 1,
                "beds": 2,
                "bathrooms": 1,
                "amenities": ["wifi", "kitchen", "parking"],
                "images": [
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
                ],
            },
        ]
        for pd in properties_data:
            prop = PropertyModel(
                id=uuid.uuid4(),
                owner_id=owner.id,
                category_id=categories[pd["cat_idx"]].id,
                city_id=cities[pd["city_idx"]].id,
                title=pd["title"],
                description=pd["description"],
                status="published",
                price_per_night=pd["price"],
                max_guests=pd["guests"],
                bedrooms=pd["bedrooms"],
                beds=pd["beds"],
                bathrooms=pd["bathrooms"],
                is_active=True,
                created_at=now,
                updated_at=now,
            )
            session.add(prop)

            for order, url in enumerate(pd["images"]):
                session.add(PropertyMediaModel(
                    id=uuid.uuid4(),
                    property_id=prop.id,
                    url=url,
                    is_primary=order == 0,
                    order=order,
                ))

            with session.no_autoflush:
                amenity_result = await session.execute(
                    select(AmenityModel).where(AmenityModel.slug.in_(pd["amenities"]))
                )
            for amenity in amenity_result.scalars().all():
                session.add(PropertyAmenityModel(property_id=prop.id, amenity_id=amenity.id))

        # Test user
        user = UserModel(
            id=uuid.uuid4(),
            email="user@issykrelax.kg",
            password_hash=hash_password("user123"),
            full_name="Тестовый Турист",
            phone="+996 700 333 444",
            is_active=True,
            is_verified=True,
            is_superuser=False,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        session.add(user)

        await session.commit()
        print("Seed data created successfully!")
        print("  Admin: admin@issykrelax.kg / admin123")
        print("  Owner: owner@issykrelax.kg / owner123")
        print("  User:  user@issykrelax.kg / user123")


if __name__ == "__main__":
    asyncio.run(seed())
