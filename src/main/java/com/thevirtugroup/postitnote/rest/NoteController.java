package com.thevirtugroup.postitnote.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.thevirtugroup.postitnote.model.Note;
import com.thevirtugroup.postitnote.services.NoteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


/**
 */
@RestController
@RequestMapping("notes")
public class NoteController {
    @Autowired
    private NoteService noteService;
    @RequestMapping(value="", method = RequestMethod.POST)
    public Note newNote(@RequestBody Note entity) {  
        return noteService.saveNote(entity);
    }
    @RequestMapping(value="", method = RequestMethod.PUT)
    public Note updateNote(@RequestBody Note entity) {  
        return noteService.updateNote(entity);
    }
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE)
    public Note deleteNote(@PathVariable Long id) {    
        Note deletedNote = noteService.deleteNote(id);  
        return deletedNote;
    }
    @RequestMapping(value="", method = RequestMethod.GET)
    public List<Note> getNotes() {        
        return noteService.getNotes();
    }
    
}
