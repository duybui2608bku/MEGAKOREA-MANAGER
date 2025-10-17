import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import menuService from '~/services/menu/menu.service'
import { CreateMenuRequestBody, GetMenusQuery, UpdateMenuRequestBody } from '~/interfaces/menu/menu.interface'
import { MENU_MESSAGES } from '~/constants/messages/menu/menu.message'

export const createMenuController = async (
  req: Request<ParamsDictionary, any, CreateMenuRequestBody>,
  res: Response
) => {
  const result = await menuService.createMenu(req.body)
  ResponseSuccess({
    message: MENU_MESSAGES.MENU_CREATED_SUCCESS,
    res,
    result
  })
}

export const getMenusController = async (req: Request<ParamsDictionary, any, any, GetMenusQuery>, res: Response) => {
  const { status = '', name = '', hideInMenu = '' } = req.query

  const result = await menuService.getAllMenus({ status, name, hideInMenu })

  ResponseSuccess({
    message: MENU_MESSAGES.MENU_GET_ALL_SUCCESS,
    res,
    result
  })
}

export const getMenuByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await menuService.getMenuById(id)
  ResponseSuccess({
    message: MENU_MESSAGES.MENU_GET_BY_ID_SUCCESS,
    res,
    result
  })
}

export const updateMenuController = async (
  req: Request<ParamsDictionary, any, UpdateMenuRequestBody>,
  res: Response
) => {
  const { id } = req.params
  const result = await menuService.updateMenu(id, req.body)
  ResponseSuccess({
    message: MENU_MESSAGES.MENU_UPDATED_SUCCESS,
    res,
    result
  })
}

export const deleteMenuController = async (req: Request, res: Response) => {
  const { id } = req.params
  await menuService.deleteMenu(id)
  ResponseSuccess({
    message: MENU_MESSAGES.MENU_DELETED_SUCCESS,
    res
  })
}
