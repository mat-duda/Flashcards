package org.example.flashcardsweb.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.sql.Date
import kotlin.time.Instant

public enum class State {
    New, Learning, Review, Relearning
}
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
    var whenCreatedDate: java.time.Instant = java.time.Instant.now(),

    @Column
    var userId: Long,

    @Column
    var deckId: Long,

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    var state: State = State.New,

    @Column(name = "due")
    var due: java.time.Instant = java.time.Instant.now(),

    @Column(name = "stability")
    var stability: Double = 0.0,

    @Column(name = "difficulty")
    var difficulty: Double = 0.0,

    @Column(name = "last_review")
    var lastReview: java.time.Instant? = null,

    @Column(name = "step")
    var step: Int = 0

)