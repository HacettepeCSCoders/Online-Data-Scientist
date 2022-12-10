package edu.ods.java.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "ROLES")
public class Role extends EntityBase {

	@Column(name = "NAME", unique = true)
	private String name;

	@ManyToMany(mappedBy = "roles")
	@JsonBackReference
	private Set<User> users;

}
