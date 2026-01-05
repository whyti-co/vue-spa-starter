import { defineComponent } from 'vue';
import Avatar from '@/components/Avatar';
import PageWrapper from '@/components/PageWrapper';

const images = [
	{
		id: 1,
		src: 'https://picsum.photos/seed/1/400/300',
		alt: 'Nature',
		author: 'Alice',
	},
	{
		id: 2,
		src: 'https://picsum.photos/seed/2/400/500',
		alt: 'City',
		author: 'Bob',
	},
	{
		id: 3,
		src: 'https://picsum.photos/seed/3/400/350',
		alt: 'Mountains',
		author: 'Charlie',
	},
	{
		id: 4,
		src: 'https://picsum.photos/seed/4/400/400',
		alt: 'Ocean',
		author: 'Diana',
	},
	{
		id: 5,
		src: 'https://picsum.photos/seed/5/400/300',
		alt: 'Forest',
		author: 'Eve',
	},
	{
		id: 6,
		src: 'https://picsum.photos/seed/6/400/450',
		alt: 'Desert',
		author: 'Frank',
	},
	{
		id: 7,
		src: 'https://picsum.photos/seed/7/400/350',
		alt: 'Lake',
		author: 'Grace',
	},
	{
		id: 8,
		src: 'https://picsum.photos/seed/8/400/300',
		alt: 'Beach',
		author: 'Henry',
	},
];

export default defineComponent({
	name: 'HomePage',
	setup() {
		return () => (
			<PageWrapper>
				<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
					{images.map((image) => (
						<div key={image.id} class="card bg-base-200 break-inside-avoid">
							<figure>
								<img
									src={image.src}
									alt={image.alt}
									class="w-full"
									loading="lazy"
								/>
							</figure>
							<div class="card-body p-3">
								<div class="flex items-center gap-2">
									<Avatar letter={image.author[0]} size="sm" />
									<div>
										<p class="text-sm font-medium">{image.author}</p>
										<p class="text-xs text-base-content/60">{image.alt}</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</PageWrapper>
		);
	},
});
