import MySwal from '@/components/swal-alert';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';

interface DeleteProps {
  roleId: string | number;
  roleName: string;
}

export default function DeleteRole({ roleId, roleName }: DeleteProps) {
  const form = useForm({});

  const handleDelete = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: `The role "${roleName}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      background: 'var(--background)',
      color: 'var(--foreground)',
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading Swal
        MySwal.fire({
          title: 'Deleting role...',
          allowOutsideClick: false,
          didOpen: () => MySwal.showLoading(),
          showConfirmButton: false,
          background: 'var(--background)',
          color: 'var(--foreground)',
        });

        form.delete(route("role.destroy", roleId), {
          preserveScroll: true,
          onSuccess: () => {
            MySwal.fire({
              icon: "success",
              title: "Deleted!",
              text: `The role "${roleName}" has been removed.`,
              timer: 1500,
              showConfirmButton: false,
              background: 'var(--background)',
              color: 'var(--foreground)',
            });
          },
          onError: () => {
            MySwal.fire({
              icon: "error",
              title: "Error!",
              text: "Failed to delete the role.",
              confirmButtonText: "OK",
              background: 'var(--background)',
              color: 'var(--foreground)',
            });
          },
        });
      }
    });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={form.processing} // disables button while request is running
      className="rounded-xl shadow-md"
    >
      {form.processing ? "Deleting..." : "Delete"}
    </Button>
  );
}
