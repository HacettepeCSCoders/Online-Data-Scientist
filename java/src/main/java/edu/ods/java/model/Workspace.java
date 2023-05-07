package edu.ods.java.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "WORKSPACES")
public class Workspace extends EntityBase {

	@Id
	@Column(name = "ID", nullable = false)
	private long id;

	@Column(name = "FILE_NAME")
	private String fileName;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "USER_ID", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;

}
