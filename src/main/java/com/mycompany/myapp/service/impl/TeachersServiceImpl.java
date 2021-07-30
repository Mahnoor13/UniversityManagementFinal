package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Teachers;
import com.mycompany.myapp.repository.TeachersRepository;
import com.mycompany.myapp.service.TeachersService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Teachers}.
 */
@Service
@Transactional
public class TeachersServiceImpl implements TeachersService {

    private final Logger log = LoggerFactory.getLogger(TeachersServiceImpl.class);

    private final TeachersRepository teachersRepository;

    public TeachersServiceImpl(TeachersRepository teachersRepository) {
        this.teachersRepository = teachersRepository;
    }

    @Override
    public Teachers save(Teachers teachers) {
        log.debug("Request to save Teachers : {}", teachers);
        return teachersRepository.save(teachers);
    }

    @Override
    public Optional<Teachers> partialUpdate(Teachers teachers) {
        log.debug("Request to partially update Teachers : {}", teachers);

        return teachersRepository
            .findById(teachers.getId())
            .map(
                existingTeachers -> {
                    if (teachers.getFirstName() != null) {
                        existingTeachers.setFirstName(teachers.getFirstName());
                    }
                    if (teachers.getLastName() != null) {
                        existingTeachers.setLastName(teachers.getLastName());
                    }
                    if (teachers.getPhone() != null) {
                        existingTeachers.setPhone(teachers.getPhone());
                    }

                    return existingTeachers;
                }
            )
            .map(teachersRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Teachers> findAll(Pageable pageable) {
        log.debug("Request to get all Teachers");
        return teachersRepository.findAll(pageable);
    }

    public Page<Teachers> findAllWithEagerRelationships(Pageable pageable) {
        return teachersRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Teachers> findOne(Long id) {
        log.debug("Request to get Teachers : {}", id);
        return teachersRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Teachers : {}", id);
        teachersRepository.deleteById(id);
    }
}
