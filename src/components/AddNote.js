import React, { useContext, useState } from 'react'
import noteContext from "../context/notes/NoteContext"

const AddNote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context;

    const [note, setNote] = useState({ Title: "", Description: "", Tag: "" })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.Title, note.Description, note.Tag);
        setNote({ Title: "", Description: "", Tag: "" })
        props.showAlert("Added Successfully","success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3">
                <div className="mb-3">
                    <label htmlFor="Title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="Title" name="Title" aria-describedby="emailHelp" value={note.Title} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="Description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="Description" name="Description" value={note.Description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="Tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="Tag" name="Tag" value={note.Tag} onChange={onChange} minLength={5} required />
                </div>

                <button disabled={note.Title.length < 5 || note.Description.length < 5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default AddNote