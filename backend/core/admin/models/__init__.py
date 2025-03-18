__all__ = [
    "setup_admin",
]


from .ai_provider import AIProviderAdmin
from .user import UserAdmin


# Register admin views
def setup_admin(admin):
    admin.add_view(AIProviderAdmin)
    admin.add_view(UserAdmin)
