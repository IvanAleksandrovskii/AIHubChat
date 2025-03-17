__all__ = [
    "setup_admin",
]


from .ai_provider import AIProviderAdmin


# Register admin views
def setup_admin(admin):
    admin.add_view(AIProviderAdmin)
