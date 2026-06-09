"""Seed the database with initial platforms and a demo account.

Run:
    python -m app.seed                          # local dev
    docker compose exec api python -m app.seed  # Docker
"""

import asyncio

from sqlalchemy import select

from app.database import async_session, engine, Base
from app.models.platform import Platform
from app.services.auth import create_user, get_user_by_email

PLATFORMS = [
    {
        "slug": "xiaohongshu",
        "display_name": "小红书",
        "description": "种草社区，女性用户为主，图文+短视频",
    },
    {
        "slug": "douyin",
        "display_name": "抖音",
        "description": "短视频平台，算法推荐，泛娱乐内容",
    },
    {
        "slug": "gongzhonghao",
        "display_name": "公众号",
        "description": "微信生态，长图文，私域流量",
    },
    {
        "slug": "weibo",
        "display_name": "微博",
        "description": "社交媒体，热搜驱动，短内容传播",
    },
]


async def seed():
    """Create tables and seed initial data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # ── Seed platforms ────────────────────────────────
        for p in PLATFORMS:
            existing = await db.execute(
                select(Platform).where(Platform.slug == p["slug"])
            )
            if existing.scalar_one_or_none() is None:
                db.add(Platform(**p))
                print(f"  + Platform: {p['display_name']} ({p['slug']})")

        await db.flush()

        # ── Seed demo user ────────────────────────────────
        demo = await get_user_by_email(db, "louisharrington@demo.ai")
        if not demo:
            demo = await create_user(
                db,
                email="LouisHarrington@demo.ai",
                password="123456",
                display_name="Louis Harrington",
                team_name="AI Content Lab",
            )
            # Demo user gets extra credits and verified status
            demo.credits_remaining = 500
            demo.is_email_verified = True
            demo.is_admin = True
            print(f"  + Demo user: LouisHarrington@demo.ai / 123456")
            print(f"    (email pre-verified, admin, 500 credits)")

        await db.commit()
        print("\nSeed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
