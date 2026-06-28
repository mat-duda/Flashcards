package org.example.flashcardsweb.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Date


@Entity
@Table(name = "flashcards")
data class Flashcard (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column()
    var frontText: String,

    @Column
    var backText: String,

    @Column
    var whenCreatedDate: Date,

    @Column
    var userId: Int,

    @Column
    var deckId: Int

)