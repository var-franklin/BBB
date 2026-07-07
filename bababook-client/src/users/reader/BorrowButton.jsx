// BorrowButton.jsx
import React, { useState, useContext, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { AuthContext } from '../../utils/AuthProvider';
import { Button, Tooltip, Modal } from 'flowbite-react';

const BorrowButton = ({ book }) => {
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [error, setError] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    checkIfRequested();
  }, [user?._id, book?._id]);

  const checkIfRequested = async () => {
    if (!user?._id || !book?._id) return;

    try {
      const response = await fetch(`http://localhost:5000/reader/borrow-requests/${user._id}`);
      if (!response.ok) throw new Error('Failed to check request status');
      
      const borrowRequests = await response.json();
      const isBookRequested = borrowRequests.some(
        request => request.bookData.id === book._id && ['pending', 'approved'].includes(request.status)
      );
      
      setIsRequested(isBookRequested);
    } catch (err) {
      console.error('Error checking request status:', err);
    }
  };

  const requestBorrow = async () => {
    if (!user || isRequested) {
      return;
    }
  
    try {
      setIsBorrowing(true);
      setError(null);
  
      const response = await fetch('http://localhost:5000/reader/request-borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          bookData: {
            id: book._id,
            title: book.bookTitle,
            author: book.authorName,
            thumbnail: book.imageURL,
            requestDate: new Date(),
            status: 'pending',
            libraryName: book.libraryName,
            libraryAddress: book.libraryAddress,
            libraryId: book.libraryId
          }
        }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to request book');
      }
  
      setIsRequested(true);
      setShowConfirmModal(true);
  
    } catch (err) {
      setError(err.message);
      console.error('Error requesting book:', err);
    } finally {
      setIsBorrowing(false);
    }
  };

  const RequestConfirmModal = ({ show, onClose }) => {
    return (
      <Modal show={show} onClose={onClose}>
        <Modal.Header>
          Book Request Submitted
        </Modal.Header>
        <Modal.Body>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Clock className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Request Sent Successfully</h3>
            <p className="text-gray-500">
              Your request has been sent to {book.libraryName}. You will be notified once the library confirms your request.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (!user) {
    return (
      <Tooltip content="Please login to borrow books">
        <div>
          <Button
            disabled
            className="w-full"
            color="blue"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Login to Borrow
          </Button>
        </div>
      </Tooltip>
    );
  }

  if (isRequested) {
    return (
      <Button
        disabled
        color="warning"
        className="w-full"
      >
        <Clock className="w-4 h-4 mr-1.5" />
        Pending
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={requestBorrow}
        disabled={isBorrowing}
        color="blue"
        className="w-full"
      >
        <BookOpen className="w-4 h-4 mr-1.5" />
        <span className="relative top-px">
          {isBorrowing ? 'Processing...' : 'Borrow'}
        </span>
      </Button>
      {error && (
        <p className="mt-2 text-red-400 text-sm text-center">{error}</p>
      )}
      <RequestConfirmModal 
        show={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
      />
    </>
  );
};

export default BorrowButton;