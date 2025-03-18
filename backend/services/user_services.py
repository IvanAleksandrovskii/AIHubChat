# services/user_service.py

from sqlalchemy import select  # , update (using just a simple commit for now)

# from async_lru import alru_cache

from core import log  # , settings
from core.models import User, db_helper


# TODO: Implement caching for user service and others
class UserService:
    @classmethod
    async def create_user(cls, chat_id: int, username: str | None) -> User:
        async with db_helper.db_session() as session:
            try:
                # Check if user exists
                result = await session.execute(
                    select(User).where(User.chat_id == chat_id)
                )
                existing_user = result.scalar_one_or_none()

                if existing_user:
                    if existing_user.username != username:
                        log.info("User %s already exists with different username", chat_id)
                        
                        updated_user = await cls.update_username(chat_id, username)
                        return updated_user
                    log.info("User %s already exists", chat_id)
                    return existing_user

                user = User(chat_id=chat_id, username=username)
                session.add(user)
                await session.commit()
                await session.refresh(user)
                return user

            except Exception as e:
                log.exception(f"Error in create_user: {e}")
                await session.rollback()

    @staticmethod  # @alru_cache(ttl=settings.bot.max_users_cached_time_seconds, maxsize=settings.bot.max_users_cached)
    async def get_user(chat_id: int) -> User | None:
        async with db_helper.db_session() as session:
            try:
                result = await session.execute(
                    select(User).where(User.chat_id == chat_id)
                )
                return result.scalar_one_or_none()
            except Exception as e:
                log.exception(f"Error in get_user: {e}")

    @staticmethod
    async def get_all_users() -> list[User]:
        async with db_helper.db_session() as session:
            try:
                result = await session.execute(select(User))
                return result.scalars().unique().all()
            except Exception as e:
                log.exception(f"Error in get_all_users: {e}")

    @staticmethod
    async def update_username(chat_id: int, new_username: str | None) -> User | None:
        async with db_helper.db_session() as session:
            try:
                user = await session.execute(
                    select(User).where(User.chat_id == chat_id)
                )
                user = user.scalar_one_or_none()
                if user:
                    user.username = new_username
                    await session.commit()
                    log.info(
                        "Updated username for user %s to %s", chat_id, new_username
                    )

                    # TODO: clear cache for updated user
                    user = await session.refresh(user)
                    return user

                else:
                    log.warning(f"User {chat_id} not found for username update")
                    return None
            except Exception as e:
                log.exception(f"Error in update_username: {e}")
                await session.rollback()
                return None

    """
    Example if is_superuser is implemented to the User model
    
    @staticmethod
    async def is_superuser(chat_id: int) -> bool:
        async with db_helper.db_session() as session:
            try:
                result = await session.execute(
                    select(User).where(User.chat_id == chat_id)
                )
                user = result.scalar_one_or_none()
                return user is not None and user.is_superuser
            except Exception as e:
                log.exception(f"Error in is_superuser: {e}")
    """
