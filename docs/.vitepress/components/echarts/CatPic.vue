<template>
  <div class="cat-carousel-3d">
    <div 
      class="carousel-container" 
      @mouseenter="onMouseEnter" 
      @mouseleave="onMouseLeave"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- 3D轮播展示区域 -->
      <div class="carousel-track">
        <div
          v-for="(image, index) in imageList"
          :key="index"
          class="carousel-slide"
          :class="{
            'active': index === currentIndex,
            'prev': index === prevIndex,
            'next': index === nextIndex,
            'hidden': !isVisibleSlide(index)
          }"
          @click="goToImage(index)"
        >
          <div class="slide-content">
            <div class="glass-overlay"></div>
            <img 
              :src="image" 
              :alt="`猫咪图片 ${index + 1}`"
              class="slide-image"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
            />
            <div v-if="loadingImages.includes(index) && !loadedImages.has(index)" class="loading-overlay">
              <div class="loading-spinner"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 左右切换按钮 - 悬停时显示 -->
      <transition name="nav-fade">
        <button 
          v-show="showNavButtons && imageList.length > 1"
          class="nav-button prev" 
          @click="prevImage"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
          </svg>
        </button>
      </transition>
      
      <transition name="nav-fade">
        <button 
          v-show="showNavButtons && imageList.length > 1"
          class="nav-button next" 
          @click="nextImage"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
          </svg>
        </button>
      </transition>

      <!-- 指示器 -->
      <div class="indicators" v-if="imageList.length > 1">
        <button
          v-for="(image, index) in imageList"
          :key="index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToImage(index)"
        ></button>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  name: 'CatCarousel3D',
  props: {
    list: {
      type: Array,
      default: () => [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1581888227599-779811939961?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop'
      ]
    },
    autoPlayInterval: {
      type: Number,
      default: 4000
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    showCounter: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '450px'
    }
  },
  data() {
    return {
      currentIndex: 0,
      autoPlayTimer: null,
      showNavButtons: false,
      loadingImages: [],
      loadedImages: new Set(),
      touchStartTime: 0
    }
  },
  computed: {
    imageList() {
      return this.list.length > 0 ? this.list : [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop'
      ]
    },
    prevIndex() {
      return this.currentIndex === 0 
        ? this.imageList.length - 1 
        : this.currentIndex - 1
    },
    nextIndex() {
      return (this.currentIndex + 1) % this.imageList.length
    }
  },
  mounted() {
    // 初始化第一张图片的加载状态
    if (this.imageList.length > 0) {
      this.loadingImages = [0]
    }
    if (this.autoPlay && this.imageList.length > 1) {
      this.startAutoPlay()
    }
  },
  beforeUnmount() {
    this.clearAutoPlay()
  },
  methods: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.imageList.length
    },
    prevImage() {
      this.currentIndex = this.currentIndex === 0 
        ? this.imageList.length - 1 
        : this.currentIndex - 1
    },
    goToImage(index) {
      if (index !== this.currentIndex) {
        this.currentIndex = index
      }
    },
    isVisibleSlide(index) {
      return index === this.currentIndex || 
             index === this.prevIndex || 
             index === this.nextIndex
    },
    startAutoPlay() {
      if (this.autoPlay && this.imageList.length > 1) {
        this.autoPlayTimer = setInterval(() => {
          this.nextImage()
        }, this.autoPlayInterval)
      }
    },
    pauseAutoPlay() {
      this.clearAutoPlay()
    },
    clearAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer)
        this.autoPlayTimer = null
      }
    },
    onMouseEnter() {
      this.showNavButtons = true
      this.pauseAutoPlay()
    },
    onMouseLeave() {
      this.showNavButtons = false
      if (this.autoPlay && this.imageList.length > 1) {
        this.startAutoPlay()
      }
    },
    onTouchStart() {
      this.touchStartTime = Date.now()
      this.pauseAutoPlay()
    },
    onTouchEnd() {
      // 短触摸后恢复自动播放
      if (Date.now() - this.touchStartTime < 200) {
        setTimeout(() => {
          if (this.autoPlay && this.imageList.length > 1) {
            this.startAutoPlay()
          }
        }, 2000)
      }
    },
    onImageLoad(index) {
      this.loadingImages = this.loadingImages.filter(i => i !== index)
      this.loadedImages.add(index)
    },
    onImageError(index) {
      this.loadingImages = this.loadingImages.filter(i => i !== index)
      console.warn('图片加载失败:', this.imageList[index])
    }
  },
  watch: {
    currentIndex(newIndex) {
      // 只有当图片未曾加载过时才显示loading状态
      if (!this.loadedImages.has(newIndex) && !this.loadingImages.includes(newIndex)) {
        this.loadingImages.push(newIndex)
      }
    },
    list: {
      handler() {
        this.currentIndex = 0
        this.loadingImages = [0]
        this.loadedImages.clear()
        this.clearAutoPlay()
        if (this.autoPlay && this.imageList.length > 1) {
          this.$nextTick(() => {
            this.startAutoPlay()
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.cat-carousel-3d {
  max-width: 100%;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  perspective: 1200px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: v-bind(height);
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 20px 60px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.carousel-slide {
  position: absolute;
  width: 85%;
  height: 95%;
  left: 50%;
  top: 50%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform-origin: center center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.carousel-slide.active {
  transform: translate(-50%, -50%) translateZ(0) scale(1);
  z-index: 3;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.carousel-slide.prev {
  transform: translate(-50%, -50%) translateZ(-200px) translateX(-120%) rotateY(25deg) scale(0.8);
  z-index: 2;
  opacity: 0.7;
}

.carousel-slide.next {
  transform: translate(-50%, -50%) translateZ(-200px) translateX(120%) rotateY(-25deg) scale(0.8);
  z-index: 2;
  opacity: 0.7;
}

.carousel-slide.hidden {
  transform: translate(-50%, -50%) translateZ(-400px) scale(0.6);
  opacity: 0;
  pointer-events: none;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.05) 75%,
    rgba(255, 255, 255, 0.1) 100%
  );
  z-index: 2;
  pointer-events: none;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.carousel-slide:hover .slide-image {
  transform: scale(1.05);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  z-index: 4;
  color: rgba(255, 255, 255, 0.9);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.nav-button.prev {
  left: 24px;
}

.nav-button.next {
  right: 24px;
}

.nav-fade-enter-active, .nav-fade-leave-active {
  transition: all 0.3s ease;
}

.nav-fade-enter-from, .nav-fade-leave-to {
  opacity: 0;
  transform: translateY(-50%) scale(0.8);
}

.indicators {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 4;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 12px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.indicator.active {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.image-counter {
  text-align: center;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-slide {
    width: 92%;
    height: 90%;
  }
  
  .nav-button {
    width: 48px;
    height: 48px;
  }
  
  .nav-button.prev {
    left: 16px;
  }
  
  .nav-button.next {
    right: 16px;
  }
  
  .indicators {
    bottom: 12px;
    gap: 6px;
    padding: 4px 10px;
  }
  
  .indicator {
    width: 7px;
    height: 7px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 300px;
    border-radius: 16px;
  }
  
  .carousel-slide {
    width: 95%;
    height: 88%;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .nav-button.prev {
    left: 12px;
  }
  
  .nav-button.next {
    right: 12px;
  }
  
  .indicators {
    bottom: 8px;
    gap: 5px;
    padding: 3px 8px;
  }
  
  .indicator {
    width: 6px;
    height: 6px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .carousel-container {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .slide-content {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .image-counter {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>