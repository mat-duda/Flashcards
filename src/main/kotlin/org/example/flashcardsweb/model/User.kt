package org.example.flashcardsweb.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "users")
data class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true)
    var name: String,

    @Column(unique = true)
    var email: String,

    @Column
    var password: String?,

    @Column(nullable = true)
    var googleId: String? = null,

    @Column(nullable = false)
    val createdAt: java.time.Instant = java.time.Instant.now()
)