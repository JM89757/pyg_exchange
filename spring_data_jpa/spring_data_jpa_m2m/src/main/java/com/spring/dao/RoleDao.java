package com.spring.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.spring.domain.Role;

public interface RoleDao extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role> {
}
