import {TaskItemObject, TaskListObject} from './objects.ts'
import {EditorIdParam} from './routesParams.ts'

export interface TaskListItemProps {
    data: TaskItemObject,
    key: string
}

export interface TaskShowItemProps {
    data: TaskItemObject
}

export interface EditorProps {
    params: EditorIdParam
    data?: TaskItemObject
}

export interface TaskListProviderProps {
    list: TaskListObject
}
