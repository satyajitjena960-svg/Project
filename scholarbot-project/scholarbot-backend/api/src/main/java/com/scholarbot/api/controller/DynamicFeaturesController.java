package com.scholarbot.api.controller;
import java.util.Map;
import com.scholarbot.api.domain.Note;
import com.scholarbot.api.domain.SyllabusItem;
import com.scholarbot.api.repository.NoteRepository;
import com.scholarbot.api.repository.SyllabusItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features")
@CrossOrigin(origins = "http://localhost:5173")
public class DynamicFeaturesController {

    @Autowired
    private SyllabusItemRepository syllabusItemRepository;

    @Autowired
    private NoteRepository noteRepository;

    // --- PERSISTENT NOTES ENDPOINTS ---
    @GetMapping("/notes/user/{userId}")
    public List<Note> getUserNotes(@PathVariable Long userId) {
        return noteRepository.findByUserId(userId);
    }

    @PostMapping("/notes/add")
    public Note addNote(@RequestBody Map<String, Object> payload) {
        Note note = new Note();
        note.setTitle(payload.get("title").toString());
        note.setContent(payload.get("content").toString());

        com.scholarbot.api.domain.User mockUser = new com.scholarbot.api.domain.User();
        mockUser.setId(Long.parseLong(payload.get("userId").toString()));
        note.setUser(mockUser);

        return noteRepository.save(note);
    }

    // --- PERSISTENT SYLLABUS ENDPOINTS ---
    @GetMapping("/syllabus/user/{userId}")
    public List<SyllabusItem> getUserSyllabus(@PathVariable Long userId) {
        return syllabusItemRepository.findByUserId(userId);
    }

    @PostMapping("/syllabus/add")
    public SyllabusItem addSyllabusItem(@RequestBody Map<String, Object> payload) {
        SyllabusItem item = new SyllabusItem();
        item.setName(payload.get("topicName").toString());
        item.setProgress(Integer.parseInt(payload.get("progress").toString()));
        item.setColor("bg-purple-500");

        com.scholarbot.api.domain.User mockUser = new com.scholarbot.api.domain.User();
        mockUser.setId(Long.parseLong(payload.get("userId").toString()));
        item.setUser(mockUser);

        return syllabusItemRepository.save(item);
    }

    @PostMapping("/notes/upload-pdf")
    public ResponseEntity<?> uploadPdfDocument(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty. Upload valid document."));
        }
        try {
            // Read incoming plain text or raw layout string logs for parsing simulation
            String parsedText = new BufferedReader(new InputStreamReader(file.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            return ResponseEntity.ok(Map.of(
                    "fileName", file.getOriginalFilename(),
                    "extractedText", parsedText
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to parse document: " + e.getMessage()));
        }
    }
}