package org.example.flashcardsweb.service

import org.example.flashcardsweb.model.Deck
import org.example.flashcardsweb.model.Flashcard
import org.example.flashcardsweb.repository.DeckRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.example.flashcardsweb.model.State
import org.example.flashcardsweb.repository.FlashcardRepository

import org.example.flashcardsweb.repository.UserRepository
import java.time.Instant
import java.time.LocalDate
import java.util.Date

@Service
class DeckService(
    private val deckRepository: DeckRepository,
    private val userRepository: UserRepository,
    private val userService: UserService,
    private val flashcardService: FlashcardService,
   private val flashcardRepository: FlashcardRepository
) {
    fun getAllDecks(): List<Deck>
    = deckRepository.findAll()

    fun getDeckById(id: Long): Deck
    = deckRepository.findById(id).orElseThrow{
        NoSuchElementException("Deck with id $id not found")
    }

    fun createDeck(deck: Deck): Deck
    = deckRepository.save(deck)

    fun deleteDeckById(deckId: Long)
    = deckRepository.deleteById(deckId)

    fun updateDeck(deckId: Long, updatedDeck: Deck): Deck {
        val deck = deckRepository.findById(deckId).orElseThrow{ NoSuchElementException("Deck with id $deckId not found") }

        deck.name = updatedDeck.name
        deck.isPublic = updatedDeck.isPublic

        return deckRepository.save(deck)
    }

    fun getPublicDecks(): List<org.example.flashcardsweb.dto.CommunityDeckDTO> {
        val publicDecks = deckRepository.findByIsPublicTrue()
        return publicDecks.map { deck ->
            val user = userRepository.findById(deck.userId).orElse(null)
            val authorName = user?.name ?: "Unknown"
            val avatarUrl = "https://api.dicebear.com/7.x/initials/svg?seed=$authorName"
            org.example.flashcardsweb.dto.CommunityDeckDTO(deck, authorName, avatarUrl)
        }
    }

    fun clonePublicDeck(deckId: Long,newUserId: Long): Deck? {

        val publicDecks = deckRepository.findByIsPublicTrue()
        val deckToClone = deckRepository.findByIdOrNull(deckId)
            ?: throw IllegalArgumentException("Deck not found")

        if(publicDecks.contains(deckToClone) && deckToClone.userId != newUserId ){
            val newDeck = Deck(
                name = deckToClone.name,
                userId = newUserId,
                isPublic = false
            )



            val userDecks = deckRepository.findByUserId(newUserId)
            if(userDecks.contains(deckToClone)){
                throw IllegalArgumentException("You already have a copy of this deck")
            }

            val savedDeck = deckRepository.save(newDeck)

            val originalCards = flashcardService.getFlashcardsByDeckId(deckId)

            val clonedCards = originalCards.map { card ->
                Flashcard(
                    frontText = card.frontText,
                    backText = card.backText,
                    deckId = savedDeck.id!!,
                    userId = newUserId,
                    whenCreatedDate = java.time.Instant.now(),
                    state = State.New,
                    due = Instant.now(),
                    stability = 0.0,
                    difficulty = 0.0,
                    step = 0
                )

            }
            flashcardRepository.saveAll(clonedCards)
            return savedDeck

        }
        else{throw IllegalArgumentException("It is your deck")}

}
}