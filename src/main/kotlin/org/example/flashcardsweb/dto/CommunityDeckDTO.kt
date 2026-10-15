package org.example.flashcardsweb.dto

import org.example.flashcardsweb.model.Deck

data class CommunityDeckDTO(
    val deck: Deck,
    val authorName: String,
    val authorProfilePictureUrl: String? = null
)
