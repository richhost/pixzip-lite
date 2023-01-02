<script lang="ts">
	import ImgComparisonSlider from './ImgComparisonSlider.svelte';
	import H3 from './H3.svelte';
</script>

<section class="max-w-7xl mx-auto px-5 md:px-10 xl:px-20 py-16" id="example">
	<H3 text="样例图片" />
	<div class="h-16" />

	<ImgComparisonSlider class="slider-split-line">
		<figure slot="first" class="before">
			<figcaption>
				<p>压缩前</p>
				<p>1.5MB</p>
			</figcaption>
			<img width="100%" loading="lazy" decoding="async" src="/images/IMG_7774.jpg" alt="" />
		</figure>
		<figure slot="second" class="after">
			<figcaption>
				<p>压缩后</p>
				<p>863KB</p>
			</figcaption>
			<img width="100%" loading="lazy" decoding="async" src="/images/IMG_7774-loss.jpg" alt="" />
			<div class="save">节省 44%</div>
		</figure>
		<svg slot="handle" xmlns="http://www.w3.org/2000/svg" width="100" viewBox="-8 -3 16 6">
			<path
				stroke="#fff"
				d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
				stroke-width="1"
				fill="#fff"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
	</ImgComparisonSlider>

	<div class="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
		<ImgComparisonSlider class="slider-split-line">
			<figure slot="first" class="before">
				<figcaption>
					<p>压缩前</p>
					<p>354KB</p>
				</figcaption>
				<img width="100%" loading="lazy" decoding="async" src="/images/1.jpg" alt="" />
			</figure>
			<figure slot="second" class="after">
				<figcaption>
					<p>压缩后</p>
					<p>181KB</p>
				</figcaption>
				<img width="100%" loading="lazy" decoding="async" src="/images/1-loss.jpg" alt="" />
				<div class="save">节省 49%</div>
			</figure>
			<svg slot="handle" xmlns="http://www.w3.org/2000/svg" width="100" viewBox="-8 -3 16 6">
				<path
					stroke="#fff"
					d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
					stroke-width="1"
					fill="#fff"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
		</ImgComparisonSlider>

		<ImgComparisonSlider class="slider-split-line">
			<figure slot="first" class="before">
				<figcaption>
					<p>压缩前</p>
					<p>227KB</p>
				</figcaption>
				<img width="100%" loading="lazy" decoding="async" src="/images/2.jpg" alt="" />
			</figure>
			<figure slot="second" class="after">
				<figcaption>
					<p>压缩后</p>
					<p>108KB</p>
				</figcaption>
				<img width="100%" loading="lazy" decoding="async" src="/images/2-loss.jpg" alt="" />
				<div class="save">节省 52%</div>
			</figure>
			<svg slot="handle" xmlns="http://www.w3.org/2000/svg" width="100" viewBox="-8 -3 16 6">
				<path
					stroke="#fff"
					d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
					stroke-width="1"
					fill="#fff"
					vector-effect="non-scaling-stroke"
				/>
			</svg>
		</ImgComparisonSlider>
	</div>
</section>

<style>
	.before,
	.after {
		margin: 0;
	}

	.before figcaption,
	.after figcaption {
		background: rgba(255, 255, 255, 0.8);
		border-radius: 4px;
		padding: 8px 16px;
		position: absolute;
		top: 16px;
		line-height: 1.35;
		backdrop-filter: blur(10px);
		font-size: 14px;
	}

	.before figcaption {
		left: 16px;
	}

	.after figcaption {
		right: 16px;
	}

	.after .save {
		background: rgb(46, 199, 44, 0.8);
		font-size: 12px;
		border-radius: 4px;
		padding: 8px 16px;
		position: absolute;
		right: 16px;
		top: 76px;
		color: #fff;
		line-height: 1;
	}
</style>
