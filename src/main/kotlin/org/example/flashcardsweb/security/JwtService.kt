package org.example.flashcardsweb.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.example.flashcardsweb.model.User
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component
import java.util.Date
import org.springframework.stereotype.Service
import javax.crypto.SecretKey


@Service
class JwtService( @Value("\${jwt.secret}")
                  private val secret: String,
                  @Value("\${jwt.expiration}")
                  private val expirationMs: Long ) {

    private val signingKey: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray())

    fun createToken(user: User) : String {
        return Jwts.builder()
            .subject(user.id.toString())
            .claim("email", user.email)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + expirationMs ))
            .signWith(signingKey)
            .compact()
    }

    fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    fun getUserIdFromToken(token: String): Long {
        val claims = extractAllClaims(token)
        return claims.subject.toLong()
    }

}