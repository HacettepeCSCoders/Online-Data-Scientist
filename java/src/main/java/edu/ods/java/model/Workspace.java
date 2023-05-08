package edu.ods.java.model;

import java.util.Date;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "WORKSPACES")
public class Workspace {

	@Id
	@Column(name = "ID", nullable = false)
	private long id;

	@Column(name = "FILE_NAME")
	private String fileName;

	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "USER_ID", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private User user;

	@Column(name = "CREATE_DATE")
	private Date createDate;

	@Column(name = "UPDATE_DATE")
	private Date updateDate;

	@Column(name = "ACTIVE")
	private boolean active;

	@Column(name = "OPERATION_TYPE")
	private String operationType;

	@PrePersist
	public void onPreSave() {
		this.setActive(true);
		this.setCreateDate(new Date());
		this.setUpdateDate(new Date());
		this.setOperationType("SAVE");
	}

	@PreUpdate
	public void onPreUpdate() {
		this.setUpdateDate(new Date());
		this.setOperationType("UPDATE");
	}

	@PreRemove
	public void onPreDelete() {
		this.setUpdateDate(new Date());
		this.setOperationType("DELETE");
	}

	public boolean isActive() {
		return active;
	}

}
