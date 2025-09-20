import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { appearContainer, appearItem } from '@/lib/animations';

const NewsArticlePage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const newsItems = t('news_items', { returnObjects: true });
  const article = newsItems.find(item => item.slug === slug);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h1 className="text-4xl font-bold mb-4">{t('news_article_not_found')}</h1>
        <p className="text-lg text-warm-gray mb-8">{t('news_article_not_found_desc')}</p>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" />{t('news_article_back_to_news')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${article.title} - Le Botocoin`}</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>
      <motion.main
        variants={appearContainer}
        initial="hidden"
        animate="show"
        className="py-24 sm:py-32"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div variants={appearItem} className="mb-8">
            <Link to="/" className="text-amber-orange hover:text-amber-600 flex items-center gap-2 mb-4">
              <ArrowLeft size={16} />
              {t('news_article_back_to_news')}
            </Link>
            <p className="text-base font-semibold leading-7 text-amber-orange">{article.category}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-chocolate-brown dark:text-soft-cream sm:text-4xl font-display">
              {article.title}
            </h1>
            <p className="mt-4 text-sm text-warm-gray">{article.date}</p>
          </motion.div>

          <motion.figure variants={appearItem} className="my-12">
            <img
              className="aspect-video rounded-2xl bg-gray-50 object-cover w-full shadow-lg"
              alt={article.title}
              src={article.image_src} />
          </motion.figure>

          <motion.div variants={appearItem} className="prose prose-lg dark:prose-invert max-w-none prose-p:text-warm-gray prose-headings:text-chocolate-brown dark:prose-headings:text-soft-cream">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default NewsArticlePage;