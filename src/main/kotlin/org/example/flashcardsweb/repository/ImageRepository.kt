package org.example.flashcardsweb.repository

import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.model.Image
import org.example.flashcardsweb.model.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ImageRepository : JpaRepository<Image, Long> {

}