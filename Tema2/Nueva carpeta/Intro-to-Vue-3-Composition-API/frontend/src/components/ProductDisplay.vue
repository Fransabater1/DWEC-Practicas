<script setup>
import { ref, computed, onMounted } from 'vue'
import ReviewForm from '@/components/ReviewForm.vue'
import ReviewList from '@/components/ReviewList.vue'

// Importamos las imágenes estáticas para que Vite las procese


const props = defineProps({
  premium: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const product = ref('Socks')
const brand = ref('Vue Mastery')
const selectedVariant = ref(0)

// Inicializamos como arrays vacíos
const details = ref([])
const variants = ref([])
const reviews = ref([])

// Diccionario para traducir el texto de la BD a la imagen importada
// La clave (izquierda) debe coincidir EXACTAMENTE con lo que viene en tu JSON


// 3. Petición al Backend (Fetch)
onMounted(async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/products')
    const datos = await respuesta.json()

    // Asignamos los detalles directos
    details.value = datos.details

    // Procesamos las variantes para arreglar la imagen
    variants.value = datos.variants;

    console.log("Datos cargados correctamente:", variants.value)
  } catch (error) {
    console.error("Error conectando con el backend:", error)
  }
})

// --- Propiedades Computadas (sin cambios importantes) ---

const title = computed(() => {
  return brand.value + ' ' + product.value
})

const image = computed(() => {
  // Protección extra: si no hay variantes cargadas, devolvemos string vacío
  if (variants.value.length === 0) return ''
  return variants.value[selectedVariant.value].image
})

const inStock = computed(() => {
  if (variants.value.length === 0) return false
  return variants.value[selectedVariant.value].quantity > 0
})

const shipping = computed(() => {
  if (props.premium) {
    return 'Free'
  }
  return 2.99
})

// --- Métodos ---

const addToCart = () => {
  emit('add-to-cart', variants.value[selectedVariant.value].id)
}

const updateVariant = (index) => {
  selectedVariant.value = index
}

const addReview = (review) => {
  reviews.value.push(review)
}
</script>

<template>
  <div class="product-display">
    
    <div v-if="variants.length === 0" class="loading-container">
      <p>Cargando calcetines...</p>
    </div>

    <div v-else class="product-container">
      <div class="product-image">
        <img v-bind:src="image">
      </div>
      <div class="product-info">
        <h1>{{ title }}</h1>

        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>

        <p>Shipping: {{ shipping }}</p>
        
        <ul>
          <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>

        <div 
          v-for="(variant, index) in variants" 
          :key="variant.id"
          @mouseover="updateVariant(index)"
          class="color-circle"
          :style="{ backgroundColor: variant.color }"
        >
        </div>

        <button
          class="button" 
          :class="{ disabledButton: !inStock }"
          :disabled="!inStock"
          v-on:click="addToCart"
        >
          Add to cart
        </button>
      </div>
    </div>
    
    <ReviewList v-if="reviews.length > 0" :reviews="reviews"></ReviewList>
    <ReviewForm @review-submitted="addReview"></ReviewForm>
  </div>
</template>