package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Teachers;
import com.mycompany.myapp.repository.TeachersRepository;
import com.mycompany.myapp.service.TeachersService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Teachers}.
 */
@RestController
@RequestMapping("/api")
public class TeachersResource {

    private final Logger log = LoggerFactory.getLogger(TeachersResource.class);

    private static final String ENTITY_NAME = "teachers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeachersService teachersService;

    private final TeachersRepository teachersRepository;

    public TeachersResource(TeachersService teachersService, TeachersRepository teachersRepository) {
        this.teachersService = teachersService;
        this.teachersRepository = teachersRepository;
    }

    /**
     * {@code POST  /teachers} : Create a new teachers.
     *
     * @param teachers the teachers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teachers, or with status {@code 400 (Bad Request)} if the teachers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teachers")
    public ResponseEntity<Teachers> createTeachers(@RequestBody Teachers teachers) throws URISyntaxException {
        log.debug("REST request to save Teachers : {}", teachers);
        if (teachers.getId() != null) {
            throw new BadRequestAlertException("A new teachers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Teachers result = teachersService.save(teachers);
        return ResponseEntity
            .created(new URI("/api/teachers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teachers/:id} : Updates an existing teachers.
     *
     * @param id the id of the teachers to save.
     * @param teachers the teachers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teachers,
     * or with status {@code 400 (Bad Request)} if the teachers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teachers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teachers/{id}")
    public ResponseEntity<Teachers> updateTeachers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Teachers teachers
    ) throws URISyntaxException {
        log.debug("REST request to update Teachers : {}, {}", id, teachers);
        if (teachers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teachers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teachersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Teachers result = teachersService.save(teachers);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teachers.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teachers/:id} : Partial updates given fields of an existing teachers, field will ignore if it is null
     *
     * @param id the id of the teachers to save.
     * @param teachers the teachers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teachers,
     * or with status {@code 400 (Bad Request)} if the teachers is not valid,
     * or with status {@code 404 (Not Found)} if the teachers is not found,
     * or with status {@code 500 (Internal Server Error)} if the teachers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teachers/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Teachers> partialUpdateTeachers(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Teachers teachers
    ) throws URISyntaxException {
        log.debug("REST request to partial update Teachers partially : {}, {}", id, teachers);
        if (teachers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teachers.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teachersRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Teachers> result = teachersService.partialUpdate(teachers);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teachers.getId().toString())
        );
    }

    /**
     * {@code GET  /teachers} : get all the teachers.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teachers in body.
     */
    @GetMapping("/teachers")
    public ResponseEntity<List<Teachers>> getAllTeachers(
        Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Teachers");
        Page<Teachers> page;
        if (eagerload) {
            page = teachersService.findAllWithEagerRelationships(pageable);
        } else {
            page = teachersService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /teachers/:id} : get the "id" teachers.
     *
     * @param id the id of the teachers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teachers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teachers/{id}")
    public ResponseEntity<Teachers> getTeachers(@PathVariable Long id) {
        log.debug("REST request to get Teachers : {}", id);
        Optional<Teachers> teachers = teachersService.findOne(id);
        return ResponseUtil.wrapOrNotFound(teachers);
    }

    /**
     * {@code DELETE  /teachers/:id} : delete the "id" teachers.
     *
     * @param id the id of the teachers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<Void> deleteTeachers(@PathVariable Long id) {
        log.debug("REST request to delete Teachers : {}", id);
        teachersService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
