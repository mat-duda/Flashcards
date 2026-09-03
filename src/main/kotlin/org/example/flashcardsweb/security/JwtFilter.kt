package org.example.flashcardsweb.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import kotlin.collections.emptyList


@Component
class JwtFilter(
  private val jwtService: JwtService
): OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
    val authHeader = request.getHeader("Authorization")
        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)

            try {
                val userId = jwtService.getUserIdFromToken(token)

                val authentication = UsernamePasswordAuthenticationToken(userId,null, emptyList())

                SecurityContextHolder.getContext().authentication = authentication

            } catch (_: Exception) {

            }


        }

        filterChain.doFilter(request, response)
    }

}