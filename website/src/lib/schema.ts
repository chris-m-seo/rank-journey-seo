const SITE = 'https://www.rankjourneyseo.com';

export const organizationId = `${SITE}/#organization`;
export const personId = `${SITE}/#person`;
export const websiteId = `${SITE}/#website`;

export function organizationNode() {
	return {
		'@type': 'Organization',
		'@id': organizationId,
		name: 'Rank Journey SEO',
		url: `${SITE}/`,
		logo: {
			'@type': 'ImageObject',
			url: `${SITE}/logo.jpg`,
			width: 1408,
			height: 1408,
		},
		sameAs: ['https://x.com/RankJourneySEO'],
		founder: { '@id': personId },
	};
}

export function personNode() {
	return {
		'@type': 'Person',
		'@id': personId,
		name: 'Chris M',
		jobTitle: 'Search engine optimisation expert',
		worksFor: { '@id': organizationId },
	};
}

export function websiteNode() {
	return {
		'@type': 'WebSite',
		'@id': websiteId,
		name: 'Rank Journey SEO',
		url: `${SITE}/`,
		inLanguage: 'en-GB',
		publisher: { '@id': organizationId },
		author: { '@id': personId },
	};
}

export function articleNode(input: {
	url: string;
	headline: string;
	description: string;
	datePublished: Date;
	dateModified?: Date;
	image?: string;
}) {
	return {
		'@type': 'BlogPosting',
		'@id': `${input.url}#article`,
		headline: input.headline,
		description: input.description,
		url: input.url,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': input.url,
		},
		inLanguage: 'en-GB',
		isAccessibleForFree: true,
		datePublished: input.datePublished.toISOString(),
		dateModified: (input.dateModified ?? input.datePublished).toISOString(),
		image: input.image,
		author: { '@id': personId },
		publisher: { '@id': organizationId },
	};
}

export function graph(nodes: Record<string, unknown>[]) {
	return {
		'@context': 'https://schema.org',
		'@graph': nodes,
	};
}
