package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Students;
import java.util.Optional;

import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.service.dto.StudentDto;
import com.mycompany.myapp.service.dto.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Students}.
 */
public interface StudentsService {
    /**
     * Save a students.
     *
     * @param students the entity to save.
     * @return the persisted entity.
     */
    Students save(Students students);

    /**
     * Partially updates a students.
     *
     * @param students the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Students> partialUpdate(Students students);

    /**
     * Get all the students.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Students> findAll(Pageable pageable);

    /**
     * Get all the students with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Students> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" students.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Students> findOne(Long id);

    /**
     * Delete the "id" students.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Students createStudent(User user, String phone);
}
