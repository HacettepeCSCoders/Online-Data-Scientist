package edu.ods.java.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class EntityBase implements Serializable {

	@Id
	@Column(name = "ID", nullable = false)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

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
