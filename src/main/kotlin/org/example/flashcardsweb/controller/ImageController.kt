package org.example.flashcardsweb.controller

import org.example.flashcardsweb.model.Image
import org.example.flashcardsweb.repository.ImageRepository
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.server.ResponseStatusException
import kotlin.time.Duration

@RestController
@RequestMapping("/api/uploads")
class ImageController(private val imageRepository: ImageRepository) {

    @PostMapping
    fun upload(
        @RequestParam("file") file: MultipartFile,
        @RequestParam("userId") userId: Long
    ): Map<String, Any> {
        if (file.size > 5 * 1024 * 1024) throw ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "File too large (max 5MB)"
        )
        if (!file.contentType?.startsWith("image/")!!) throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Only images allowed")

        val image = imageRepository.save(
            Image(
                filename = file.originalFilename ?: "upload",
                contentType = file.contentType!!,
                data = file.bytes,
                userId = userId
            )
        )

        return mapOf(
            "id" to image.imageId!!,
            "url" to "/api/uploads/${image.imageId}"
        )
    }

    @GetMapping("/{id}")
    fun serve(@PathVariable id: Long): ResponseEntity<ByteArray> {
        val image = imageRepository.findById(id)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND) }

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(image.contentType))
            .body(image.data)
    }
}