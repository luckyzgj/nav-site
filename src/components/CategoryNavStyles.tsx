'use client';

export default function CategoryNavStyles() {
  return (
    <style jsx global>{`
      .category-nav-link.active-category {
        font-weight: 500;
        color: #ff734e;
        background-color: rgb(255, 243, 237);
        box-shadow: 0 0.1rem 0.25rem rgba(240, 133, 100, 0.1);
      }
    `}</style>
  );
}
