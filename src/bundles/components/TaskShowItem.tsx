import {useNavigate} from 'react-router-dom'
import {useState} from 'react'
import {SmallSpinner} from './Spinner.tsx'

import {TaskShowItemProps} from '../shared/props.ts'
import {ProcessDate} from '../utils/tools.ts'

import {TaskService} from '../utils/services.ts'


export function TaskShowItem(props: TaskShowItemProps): JSX.Element {
    const finished_at: string = props.data.finished_at == null ?
        'Não definido' : new ProcessDate(props.data.finished_at).decode()

    const created_at: string = new ProcessDate(props.data.created_at).decode()

    const navigate = useNavigate()

    const [awaitUpdate, setAwaitUpdate] = useState<boolean>(false)
    const [awaitDeletion, setAwaitDeletion] = useState<boolean>(false)

    const [isFinished, setIsFinished] = useState<boolean>(props.data.done)

    function handleEditTaskButton() {
        navigate(`/editor/${props.data.id}`)
    }
    function handleDeleteTaskButton() {
        setAwaitDeletion(true)
        TaskService.deleteTaskFromId(props.data.id).then(() => {
            navigate('/')
        })
    }
    function handleFinishTaskButton() {
        if (!isFinished) {
            setAwaitUpdate(true)
            TaskService.finishTaskFromId(props.data.id).then(() => {
                setAwaitUpdate(false)
                setIsFinished(true)
            })
        }
    }

    const HandleNoFinishedTask = (): JSX.Element => {
        return !awaitUpdate ? (<>Concluir Tarefa</>) : (<SmallSpinner/>)
    }


    return (<div className='TaskShowItem Card'>
        <section>
            <div>id: {props.data.id}</div>
            <div>
                <h4 className='TitleSpacing'>Nome</h4>
                <p>{props.data.name}</p>
            </div>
        </section>
        <section>
            <div>
                <h4>Criação:</h4>
                <span>{created_at}</span>
            </div>
            <div>
                <h4>Prazo:</h4>
                <span>{finished_at}</span>
            </div>
            <div>
                <h4 className='TitleSpacing'>Status</h4>
                <div className='TaskStatusWidget'>
                    <span>{isFinished ? 'Concluída' : 'Pendente'}</span>
                    <div className={isFinished ? 'StatusFinished' : 'StatusNoFinished'}/>
                </div>
            </div>
        </section>
        <section>
            <h4 className='TitleSpacing'>Descrição</h4>
            <p>{props.data.description}</p>
        </section>
        <section>
            <button className='Button' onMouseUp={handleEditTaskButton}>Editar</button>
            <button className='Button' onMouseUp={handleDeleteTaskButton}>
                {!awaitDeletion ? 'Excluir' : (<SmallSpinner/>)}
            </button>
            <button
                onMouseUp={handleFinishTaskButton}
                className={`
                    Button
                    ${isFinished && 'FinishedButtonStyle'}
                `}>
                {!isFinished ? (<HandleNoFinishedTask/>) : 'Concluída'}
            </button>
        </section>
    </div>)
}
