import { FunctionalComponent, h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { appconfig } from '../../appconfig';

import style from './style.css';
//import Note from '../note';

export interface NoteModel {
    note_id: number;
    noteText: string;
    noteDate: string;
    finished: boolean;
}

const NoteContainer: FunctionalComponent = () => {
    const [noteData, setData] = useState<Array<NoteModel>>([]);
    const [newNote, setNewNote] = useState<string>("");


    async function onTimer() : Promise<void> {
        const res = await fetch(appconfig.API_URL + "Note", {
            headers: {'Content-Type': 'text/plain'},
            mode: 'cors',
            method: "GET",
        })
            .then(res => res.json())
            .then(res => setData(res));
    }

    async function setFinished(note_id : number, finished : boolean) : Promise<void> {
        fetch(appconfig.API_URL + "Note/" + note_id, {
            method: 'POST',
            body: JSON.stringify({finished: !finished}),
            headers: {'Content-Type': 'application/json'}
        }).then(res => onTimer());
    };

    function today() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var hh = String(today.getHours()).padStart(2, '0');
        var min = String(today.getMinutes()).padStart(2, '0');

        return dd + '/' + mm + '/' + yyyy + ', ' + hh + ':' + min;
    }

    async function saveNote() {
        const nid = () => {if(noteData.length > 0) { return noteData[noteData.length-1].note_id+1} return 0;}
        fetch(appconfig.API_URL + "Note", {
            method: 'POST',
            body: JSON.stringify({
                note_id: nid(),
                noteText: newNote,
                noteDate: today(),
                finished: false
              }),
            headers: {'Content-Type': 'application/json'}
        }).then(res => {
            if(res.status == 201) {
                setNewNote("");
            }
        }).then(()=> onTimer());
    }

    function handleChange(e : any) {
        console.log("change!");
        setNewNote(e.target.value);
    }

    async function deleteNote(note_id : number) : Promise<void> {
        const cf = confirm("Are you sure you want to delete this note?")

        if(cf) {
            fetch(appconfig.API_URL + "Note/" + note_id, {
                method: 'DELETE'}).then(res => onTimer());
        }
    };

    useEffect(() => {
        onTimer();
        const timerInterval = setInterval(() => {onTimer()}, 10000);
        return () => clearInterval(timerInterval);
    }, []);

    return(
        <div class="row">
            <div class="col-md-8">
                <div class={style.note_container}>
                    {noteData.reverse().map((data, key) => {
                        return(
                            <div class={style.note}>
                                <div class={style.note_date}>{data.noteDate}</div>
                                <div class={style.note_finished}>
                                    <button class="btn" onClick={()=> setFinished(data.note_id, data.finished)}>
                                        {data.finished && <i class="fas fa-check"></i>}
                                        {!data.finished && <i class="fas fa-times"></i>}
                                    </button>
                                </div>
                                <div class={style.note_text}>{data.noteText}</div>
                                <div class={style.note_delete}>
                                    <button class="btn" onClick={() => deleteNote(data.note_id)}><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div class="col-md-4">
                <div class={style.note_form}>
                    <form onSubmit={saveNote} action="#">
                        <div class="form-group">
                            <label>New note</label>
                            <textarea class={style.note_textarea + ' form-control'} rows={5} value={newNote} onInput={handleChange}/>
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btn btn-primary btn-lg btn-block" value="Save" />
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default NoteContainer;