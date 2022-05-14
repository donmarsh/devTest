package com.thevirtugroup.postitnote.services;

import java.util.ArrayList;
import java.util.List;

import com.thevirtugroup.postitnote.model.Note;
import com.thevirtugroup.postitnote.repository.NoteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
@Service
@Component
public class NoteService {
    @Autowired
    private NoteRepository noteRepository;

    //POST
    public Note saveNote(Note note) {
        return noteRepository.save(note);
    }
   
    //GET
    public List<Note> getNotes() {
        Iterable<Note> notesFound = noteRepository.findAll();
        List<Note> result = new ArrayList<Note>();
        notesFound.forEach(result::add);
        return result;
    }
    public Note getNoteById(Long id) {
        return noteRepository.findOne(id);
    }
    
    //PUT
    public Note updateNote(Note note) {
        Note existing_note = noteRepository.findOne(note.getId());
        existing_note.setNoteText(note.getNoteText());
        existing_note.setNoteTitle(note.getNoteTitle());
        return noteRepository.save(existing_note);
    }

    //DELETE
    public Note deleteNote(Long id) {
        Note currentNote = noteRepository.findOne(id);
        if(currentNote!=null)
        {
            noteRepository.delete(id);
        }
        return currentNote;
    }
}
