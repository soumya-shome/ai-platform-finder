
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/directory')}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Platform"}
      </Button>
    </div>
  );
};

export default FormActions;
