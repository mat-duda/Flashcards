package org.example.flashcardsweb.security

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class GoogleTokenVerifier(
    @Value("\${google.client-id}") private val clientId: String
) {
    fun verify(idTokenString: String): GoogleIdToken.Payload {
        val verifier = GoogleIdTokenVerifier.Builder(
            GoogleNetHttpTransport.newTrustedTransport(),
            GsonFactory.getDefaultInstance()
        )
            .setAudience(listOf(clientId))
            .build()

        val idToken = verifier.verify(idTokenString)
            ?: throw RuntimeException("Invalid Google token")

        return idToken.payload
        // payload.email → user's email
        // payload.get("name") → user's name
        // payload.subject → Google user ID
    }
}