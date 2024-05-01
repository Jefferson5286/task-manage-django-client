import {useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {BigSpinner} from '../components/Spinner.tsx'

import {EditorIdParam} from '../shared/routesParams.ts'
import {TaskItemObject} from '../shared/objects.ts'

import {TaskService} from '../utils/services.ts'

import Editor from '../components/Editor.tsx'


export default function TaskEditor(): JSX.Element {
    const params: EditorIdParam = useParams()

    const [isLoadingTask, setIsLoadingTask] = useState<boolean>(false)
    const [initialize, setInitialize] = useState<boolean>(false)
    const [task, setTask] = useState<TaskItemObject>()


    useEffect(() => {
        if (initialize) {
            if (params.id) {
                setIsLoadingTask(true)

                TaskService.getTaskFromId(params.id).then((data: TaskItemObject) => {
                    setTask(data)
                    setIsLoadingTask(false)
                })
            }
        } else {
            setInitialize(true)
        }
    }, [initialize, params.id]);

    return <main className='MainContainerCentered'>
        <h1>{params.id ? 'Editar tarefa' : 'Criar nova tarefa'}</h1>
        {
            !params.id
                ? (<Editor params={params}/>)
                : (<>{
                    isLoadingTask
                        ? (<BigSpinner/>)
                        : (<Editor params={params} data={task}/>)
                }</>)
        }
    </main>
}
