import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisiblePages?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const renderPageButtons = () => {
    const pageButtons = []

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    if (startPage > 1) {
      pageButtons.push(
        <button
          key={1}
          className={styles.paginationPage}
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      )
      if (startPage > 2) {
        pageButtons.push(
          <div key="ellipsis1" className={styles.paginationEllipsis}>
            ...
          </div>
        )
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`${styles.paginationPage} ${i === currentPage ? styles.isActive : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <div key="ellipsis2" className={styles.paginationEllipsis}>
            ...
          </div>
        )
      }
      pageButtons.push(
        <button
          key={totalPages}
          className={styles.paginationPage}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      )
    }

    return pageButtons
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="이전 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12.5 15l-5-5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.paginationPages}>{renderPageButtons()}</div>

      <button
        className={styles.paginationBtn}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="다음 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 15l5-5-5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
