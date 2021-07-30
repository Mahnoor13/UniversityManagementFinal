package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Teachers;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Teachers}.
 */
public interface TeachersService {
    /**
     * Save a teachers.
     *
     * @param teachers the entity to save.
     * @return the persisted entity.
     */
    Teachers save(Teachers teachers);

    /**
     * Partially updates a teachers.
     *
     * @param teachers the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Teachers> partialUpdate(Teachers teachers);

    /**
     * Get all the teachers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Teachers> findAll(Pageable pageable);

    /**
     * Get all the teachers with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Teachers> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" teachers.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Teachers> findOne(Long id);

    /**
     * Delete the "id" teachers.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
