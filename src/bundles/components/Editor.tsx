import {useNavigate} from 'react-router-dom'
import {SmallSpinner} from './Spinner.tsx'
import {useState} from 'react'

import {EditorProps} from '../shared/props.ts'
import {PartialTaskItemObject, TaskItemObject, TaskSaveObject} from '../shared/objects.ts'
import {ChangeEvent} from 'react'
import {ProcessDate} from '../utils/tools.ts'

import {TaskService} from '../utils/services.ts'


export default function Editor(props: EditorProps): JSX.Element {
    const id: string | undefined = props.params.id
    const navigate = useNavigate()

    const data: TaskSaveObject = {
        name: props.data?.name ? props.data?.name : '',
        done: props.data?.done ? props.data?.done : false,
        description: props.data?.description ? props.data?.description : '',
        finished_at: props.data?.finished_at ? new ProcessDate(props.data?.finished_at).decode() : ''
    }

    const [formState, setFormState] = useState<TaskSaveObject>(data)

    const [controllerInputDate1, setControllerInputDate1] = useState<boolean>(true)
    const [controllerInputDate2, setControllerInputDate2] = useState<boolean>(false)

    const [awaitDeletion, setAwaitDeletion] = useState<boolean>(false)
    const [awaitSave, setAwaitSave] = useState<boolean>(false)


    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const name: string = event.target.name
        let value: string = event.target.value

        if (name === 'finished_at') {
            value = value.replace(/[^\d/]/g, '')

            if (value.length === 2 && controllerInputDate1) {
                value += '/'
                setControllerInputDate1(false)
                setControllerInputDate2(true)
            }
            else if (value.length === 1 && !controllerInputDate1)
                setControllerInputDate1(true)

            else if (value.length === 5 && controllerInputDate2) {
                value += '/'
                setControllerInputDate2(false)
            }
            else if (value.length === 4 && !controllerInputDate2)
                setControllerInputDate2(true)
        }
        else if (name == 'done') {
            formState.done = value === '1'
        }
        setFormState({...formState, [name]: value})
        console.log(formState)
    }

    function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        setFormState({...formState, description: event.target.value})
    }

    function handleCancelButton(): void {
        navigate('/')
    }

    function handleSaveButton(): void {
        setAwaitSave(true)

        const content: PartialTaskItemObject = {
            name: formState.name,
            description: formState.description
        }

        if (formState.finished_at && formState.finished_at !== '')
            content.finished_at = new ProcessDate(formState.finished_at).encode()

        console.log(content.finished_at)

        if (id) {
            content.done = formState.done
            content.id = id

            TaskService.updateTaskContent(content).then(() => {
                setAwaitSave(false)
                navigate(`/${id}`)
            })
        } else {
            TaskService.createTask(content).then((data: TaskItemObject) => {
                setAwaitSave(false)
                navigate(`/${data.id}`)
            })
        }
    }

    function handleDeleteButton(): void {
        if (id) {
            setAwaitDeletion(true)
            TaskService.deleteTaskFromId(id).then(() => {
                setAwaitDeletion(false)
                navigate('/')
            })
        }
    }

    return (<form className='TaskEditorForm Card'>
        <section>
            <div className='TextInput'>
                <label htmlFor='name'>Nome</label>
                <input
                    type='text'
                    required={true}
                    value={formState.name}
                    name='name'
                    id='name'
                    onChange={handleInputChange}
                />
            </div>
            <div className='TextInput'>
                <label htmlFor='finished_at'>Prazo final</label>
                <input
                    type='text'
                    inputMode='tel'
                    value={formState.finished_at}
                    name='finished_at'
                    id='finshed_at'
                    minLength={10}
                    maxLength={10}
                    placeholder='31/03/2024'
                    onChange={handleInputChange}
                />
            </div>
            {id && (
                <div className='RadioSelector'>
                    <h4>Status de Tarefa</h4>
                    <div>
                        <div>
                            <label htmlFor='pending'>Pendente</label>
                            <input
                                name='done'
                                type='radio'
                                defaultChecked={!formState.done}
                                value='0'
                                id='pending'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor='concluded'>Concluído</label>
                            <input
                                name='done'
                                type='radio'
                                defaultChecked={formState.done}
                                value='1'
                                id='concluded'
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div className='TextInput'>
                <label htmlFor='description'>Descrição</label>
                <textarea
                    name='description'
                    id='description'
                    value={formState.description}
                    maxLength={255}
                    onChange={handleTextareaChange}
                />
            </div>
        </section>
        <section>
            <button className='Button' onMouseUp={handleCancelButton} type='button'>Cancelar</button>
            {id && (
                <button className='Button' onMouseUp={handleDeleteButton} type='button' value='delet'>
                    {awaitDeletion ? (<SmallSpinner/>) : 'Deletar'}
                </button>
            )}
            <button className='Button' onMouseUp={handleSaveButton} type='button'>
                {awaitSave ? <SmallSpinner/> : 'Salvar'}
            </button>
        </section>
    </form>)
}
