import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {TaskShowItem} from '../components/TaskShowItem.tsx'
import {BigSpinner} from '../components/Spinner.tsx'

import {TaskItemObject} from '../shared/objects.ts'
import {EditorIdParam} from '../shared/routesParams.ts'

import {TaskService} from '../utils/services.ts'


export default function TaskShow(): JSX.Element {
    const params: EditorIdParam = useParams()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const [task, setTask] = useState<TaskItemObject>(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [initialize, setInitialize] = useState<boolean>(false)

    useEffect(() => {
        if (initialize) {
            const fetchTask = async () => {
                console.log('carregado')
                return await TaskService.getTaskFromId(params.id)
            }

            fetchTask().then(data => {
                setTask(data)
                setIsLoaded(true)
            })
        } else {
            setInitialize(true)
        }
    }, [initialize, params.id]);


    return (<main>
        <div>
            <h1>Tarefa</h1>
            {isLoaded
                ? <TaskShowItem data={task}/>
                : <BigSpinner/>}
        </div>
    </main>)
}
