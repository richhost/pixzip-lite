import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type {
  AlertDialogContentProps,
  AlertDialogProps,
} from "@radix-ui/react-alert-dialog";
import "./alert-dialog.scss";

type Props = AlertDialogContentProps & {
  title?: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onCancel?: () => void;
  onAction?: () => void;
};

export const AlertContent: React.FC<Props> = ({
  className,
  title,
  description,
  cancelText,
  actionText,
  onCancel,
  onAction,
  ...props
}) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="alert-dialog-overlay" />
      <AlertDialogPrimitive.Content
        className={"alert-dialog-content " + className}
        {...props}
      >
        <AlertDialogPrimitive.Title className="alert-dialog-title">
          {title}
        </AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="alert-dialog-description">
          {description}
        </AlertDialogPrimitive.Description>
        <div className="alert-dialog-footer">
          <AlertDialogPrimitive.Cancel
            asChild
            onClick={() => onCancel && onCancel()}
          >
            <button className="button-cancel">{cancelText || "取消"}</button>
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Action
            asChild
            onClick={() => onAction && onAction()}
          >
            <button className="button-action">
              {actionText || "是，删除"}
            </button>
          </AlertDialogPrimitive.Action>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
};

export const AlertDialog: React.FC<
  AlertDialogProps & {
    onCancel?: () => void;
    onAction?: () => void;
    title?: string;
    description?: string;
    cancelText?: string;
    actionText?: string;
  }
> = ({
  title,
  description,
  cancelText,
  actionText,
  onCancel,
  onAction,
  ...props
}) => {
  return (
    <AlertDialogPrimitive.Root {...props}>
      <AlertContent
        title={title}
        description={description}
        cancelText={cancelText}
        actionText={actionText}
        onCancel={onCancel}
        onAction={onAction}
      />
    </AlertDialogPrimitive.Root>
  );
};
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
