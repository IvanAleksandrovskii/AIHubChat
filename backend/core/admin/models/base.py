# core/admin/models/base.py

from typing import Any

from fastapi import UploadFile
from sqladmin import ModelView, action
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.requests import Request
from starlette.responses import RedirectResponse

from core import log
from core.admin import async_sqladmin_db_helper


# TODO: Add logic on file upload to delete old file in case of update with the new file and on model object deletion
class BaseAdminModel(ModelView):
    column_list = ["id", "is_active"]
    column_details_list = "__all__"
    column_sortable_list = [
        "id",
        "is_active",
    ]  # TODO: Put created_at, updated_at to mixin
    column_searchable_list = ["id"]
    column_filters = ["is_active"]

    page_size = 50
    page_size_options = [25, 50, 100, 200, 500]

    can_create = True
    can_edit = True
    can_delete = True
    can_view_details = True

    # TODO: Put to mixin
    # form_excluded_columns = ['created_at', 'updated_at']

    form_widget_args = {
        "id": {"readonly": True},
        # TODO: Put to mixin
        # 'created_at': {'disabled': True},
        # 'updated_at': {'disabled': True},
    }

    @property
    def session(self):
        return AsyncSession(async_sqladmin_db_helper.engine)

    async def get_one(self, _id):
        async with self.session as session:
            stmt = select(self.model).options(selectinload("*")).filter_by(id=_id)
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def get_form(self, form_class, obj: Any = None):
        return await super().get_form(form_class, obj)

    """
    Could be added if needed for fastapi_storage

    async def _handle_file_upload(self, field_name: str, file: UploadFile):
        if isinstance(file, UploadFile):
            content = await file.read()
        else:
            raise ValueError(f"Unsupported file type for {field_name}")
        return content

    async def _update_model_fields(self, session: AsyncSession, model: Any, data: dict):
        for key, value in data.items():
            if hasattr(model, key):
                setattr(model, key, value)
        """

    """
    Cool interface features, can select multiple rows and activate/deactivate (and everything you want) them right from the list page
    """

    async def _process_action(self, request: Request, is_active: bool) -> None:
        pks = request.query_params.get("pks", "").split(",")
        if pks:
            async with self.session as session:
                async with session.begin():
                    for pk in pks:
                        model = await session.get(self.model, pk)
                        if model:
                            model.is_active = is_active
                    await session.commit()
                log.info(
                    f"Successfully {'activated' if is_active else 'deactivated'} {len(pks)} {self.name}(s)"
                )

    @action(
        name="activate",
        label="Activate",
        confirmation_message="Are you sure you want to activate selected %(model)s?",
        add_in_detail=True,
        add_in_list=True,
    )
    async def activate(self, request: Request) -> RedirectResponse:
        await self._process_action(request, True)
        return RedirectResponse(
            request.url_for("admin:list", identity=self.identity), status_code=302
        )

    @action(
        name="deactivate",
        label="Deactivate",
        confirmation_message="Are you sure you want to deactivate selected %(model)s?",
        add_in_detail=True,
        add_in_list=True,
    )
    async def deactivate(self, request: Request) -> RedirectResponse:
        await self._process_action(request, False)
        return RedirectResponse(
            request.url_for("admin:list", identity=self.identity), status_code=302
        )
