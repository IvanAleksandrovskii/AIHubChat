# core/admin/models/user.py

from core.admin.models.base import BaseAdminModel
from core.models import User


class UserAdmin(BaseAdminModel, model=User):
    column_list = [User.id, User.chat_id, User.username, User.is_active, User.created_at, User.updated_at]
    column_searchable_list = [User.id, User.chat_id, User.username]
    column_sortable_list = [User.id, User.chat_id, User.username, User.is_active, User.created_at, User.updated_at]
    column_filters = [User.chat_id, User.username]
    column_details_list = [User.id, User.chat_id, User.username, User.is_active, User.created_at, User.updated_at]
    form_excluded_columns = ["created_at", "updated_at"]
    can_create = True  # TODO: It should be False but keeping True for now
    can_edit = True  # TODO: It should be False but keeping True for now
    can_delete = True
    name = "User"
    name_plural = "Users"
    category = "User's data"
    icon = "fas fa-user-alt"
