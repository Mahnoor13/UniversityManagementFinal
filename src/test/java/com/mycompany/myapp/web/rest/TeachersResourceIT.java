package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Teachers;
import com.mycompany.myapp.repository.TeachersRepository;
import com.mycompany.myapp.service.TeachersService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link TeachersResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class TeachersResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/teachers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TeachersRepository teachersRepository;

    @Mock
    private TeachersRepository teachersRepositoryMock;

    @Mock
    private TeachersService teachersServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeachersMockMvc;

    private Teachers teachers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teachers createEntity(EntityManager em) {
        Teachers teachers = new Teachers().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME).phone(DEFAULT_PHONE);
        return teachers;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teachers createUpdatedEntity(EntityManager em) {
        Teachers teachers = new Teachers().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).phone(UPDATED_PHONE);
        return teachers;
    }

    @BeforeEach
    public void initTest() {
        teachers = createEntity(em);
    }

    @Test
    @Transactional
    void createTeachers() throws Exception {
        int databaseSizeBeforeCreate = teachersRepository.findAll().size();
        // Create the Teachers
        restTeachersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teachers)))
            .andExpect(status().isCreated());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeCreate + 1);
        Teachers testTeachers = teachersList.get(teachersList.size() - 1);
        assertThat(testTeachers.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testTeachers.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testTeachers.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createTeachersWithExistingId() throws Exception {
        // Create the Teachers with an existing ID
        teachers.setId(1L);

        int databaseSizeBeforeCreate = teachersRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeachersMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teachers)))
            .andExpect(status().isBadRequest());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTeachers() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        // Get all the teachersList
        restTeachersMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teachers.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTeachersWithEagerRelationshipsIsEnabled() throws Exception {
        when(teachersServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeachersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(teachersServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllTeachersWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(teachersServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeachersMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(teachersServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getTeachers() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        // Get the teachers
        restTeachersMockMvc
            .perform(get(ENTITY_API_URL_ID, teachers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teachers.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingTeachers() throws Exception {
        // Get the teachers
        restTeachersMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTeachers() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();

        // Update the teachers
        Teachers updatedTeachers = teachersRepository.findById(teachers.getId()).get();
        // Disconnect from session so that the updates on updatedTeachers are not directly saved in db
        em.detach(updatedTeachers);
        updatedTeachers.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).phone(UPDATED_PHONE);

        restTeachersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTeachers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTeachers))
            )
            .andExpect(status().isOk());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
        Teachers testTeachers = teachersList.get(teachersList.size() - 1);
        assertThat(testTeachers.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testTeachers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testTeachers.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, teachers.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teachers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(teachers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(teachers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTeachersWithPatch() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();

        // Update the teachers using partial update
        Teachers partialUpdatedTeachers = new Teachers();
        partialUpdatedTeachers.setId(teachers.getId());

        partialUpdatedTeachers.lastName(UPDATED_LAST_NAME).phone(UPDATED_PHONE);

        restTeachersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeachers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeachers))
            )
            .andExpect(status().isOk());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
        Teachers testTeachers = teachersList.get(teachersList.size() - 1);
        assertThat(testTeachers.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testTeachers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testTeachers.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateTeachersWithPatch() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();

        // Update the teachers using partial update
        Teachers partialUpdatedTeachers = new Teachers();
        partialUpdatedTeachers.setId(teachers.getId());

        partialUpdatedTeachers.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).phone(UPDATED_PHONE);

        restTeachersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTeachers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTeachers))
            )
            .andExpect(status().isOk());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
        Teachers testTeachers = teachersList.get(teachersList.size() - 1);
        assertThat(testTeachers.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testTeachers.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testTeachers.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, teachers.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teachers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(teachers))
            )
            .andExpect(status().isBadRequest());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTeachers() throws Exception {
        int databaseSizeBeforeUpdate = teachersRepository.findAll().size();
        teachers.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTeachersMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(teachers)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Teachers in the database
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTeachers() throws Exception {
        // Initialize the database
        teachersRepository.saveAndFlush(teachers);

        int databaseSizeBeforeDelete = teachersRepository.findAll().size();

        // Delete the teachers
        restTeachersMockMvc
            .perform(delete(ENTITY_API_URL_ID, teachers.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Teachers> teachersList = teachersRepository.findAll();
        assertThat(teachersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
