<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRules;
use Illuminate\Validation\ValidationException;

/**
 * AuthController - Authentication via Laravel Sanctum
 *
 * Gere l'ensemble du cycle de vie d'authentification :
 * - Inscription / Connexion / Deconnexion
 * - Generation et revocation de tokens Sanctum
 * - Gestion du profil et du mot de passe
 * - Verification d'email
 * - Gestion des sessions actives
 */
class AuthController extends Controller
{
    /**
     * INSCRIPTION
     * 
     * Cree un nouveau compte utilisateur et genere
     * un token Sanctum pour l'authentification immediate.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name'  => ['required', 'string', 'max:100'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone'      => ['nullable', 'string', 'max:20', 'unique:users,phone'],
            'password'   => ['required', 'confirmed', PasswordRules::defaults()->min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $user = User::create([
            'first_name'      => $validated['first_name'],
            'last_name'       => $validated['last_name'],
            'email'           => $validated['email'],
            'phone'           => $validated['phone'] ?? null,
            'password'        => Hash::make($validated['password']),
            'email_verified_at' => null,
        ]);

        // Declencher l'evenement d'inscription (envoi d'email de verification)
        // event(new Registered($user));

        // Generer le token Sanctum
        $token = $user->createToken(
            name: 'auth-token-' . Str::random(8),
            abilities: ['*']
        )->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription reussie. Un email de verification a ete envoye.',
            'data'    => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user->only(['id', 'first_name', 'last_name', 'email', 'phone']),
            ],
        ], 201);
    }

    /**
     * CONNEXION
     * 
     * Authentifie l'utilisateur et genere un token Sanctum.
     * Accepte l'email ou le telephone comme identifiant.
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => ['required_without:phone', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Determiner le champ d'identification (email ou phone)
        $field = isset($validated['email']) ? 'email' : 'phone';
        // $field = isset($validated['email']) ?? 'email' ; 
        $credentials = [
            $field     => $validated[$field],
            'password' => $validated['password'],
        ];

        // Tentative d'authentification
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $user = Auth::user();

        // Supprimer les anciens tokens si necessaire (mode single-session)
        // $user->tokens()->delete();

        // Generer un nouveau token Sanctum
        $tokenName = 'auth-token-' . $request->ip() . '-' . Str::random(6);

        $token = $user->createToken(
            name: $tokenName,
            abilities: ['*']
        )->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion reussie.',
            'data'    => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user->only([
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                ]),
            ],
        ]);
    }

    /**
     * PROFIL UTILISATEUR (ME)

     * Retourne les informations de l'utilisateur
     * authentifie via le token Sanctum.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'user' => $user->only([
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone'
                ]),
            ],
        ]);
    }

    /**
     * MISE A JOUR DU PROFIL
     * 
     * Met a jour les informations du profil utilisateur.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name'      => ['sometimes', 'required', 'string', 'max:100'],
            'last_name'       => ['sometimes', 'required', 'string', 'max:100'],
            'phone'           => ['sometimes', 'required', 'string', 'max:20', 'unique:users,phone,' . $user->id],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis a jour avec succes.',
            'data'    => [
                'user' => $user->only([
                    'id',
                    'first_name',
                    'last_name',
                    'email',
                    'phone',
                ]),
            ],
        ]);
    }

    /**
     * CHANGEMENT DE MOT DE PASSE
     * 
     * Permet a l'utilisateur connecte de changer
     * son mot de passe en fournissant l'ancien.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password'         => ['required', 'confirmed', 'different:current_password', PasswordRules::defaults()->min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Option : invalider tous les tokens sauf le courant
        // $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifie avec succes.',
        ]);
    }

    /**
     *
     * DECONNEXION (Token courant)
     * 
     * Revoque le token Sanctum utilise pour
     * cette requete. Deconnexion de l'appareil courant.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        // Supprimer le token courant
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deconnexion reussie. Le token a ete revoque.',
        ]);
    }

    /**
     * DECONNEXION DE TOUS LES APPAREILS

     * Revoque tous les tokens Sanctum de l'utilisateur.
     * Deconnexion globale.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        // Supprimer tous les tokens
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Tous les tokens ont ete revoques. Deconnexion de tous les appareils.',
        ]);
    }


    /**
     * MOT DE PASSE OUBLIE
     * 
     * Envoie un lien de reinitialisation de mot de passe
     * a l'adresse email fournie.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Un lien de reinitialisation a ete envoye a votre adresse email.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Impossible d\'envoyer le lien de reinitialisation.',
            'errors'  => ['email' => [__($status)]],
        ], 422);
    }

    /**
     * REINITIALISATION DU MOT DE PASSE
     * 
     * Reinitialise le mot de passe avec le token
     * recu par email.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => ['required', 'string'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'confirmed', PasswordRules::defaults()->min(8)->mixedCase()->numbers()->symbols()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));

                // Supprimer tous les tokens existants pour forcer reconnexion
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Votre mot de passe a ete reinitialise avec succes.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'La reinitialisation a echoue.',
            'errors'  => ['email' => [__($status)]],
        ], 422);
    }

    /**
     * VERIFICATION D'EMAIL
     * 
     * Verifie l'adresse email de l'utilisateur via
     * un lien signe envoye par email.
     *
     * @param Request $request
     * @param int $id
     * @param string $hash
     * @return JsonResponse
     */
    public function verifyEmail(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::findOrFail($id);

        // Verifier le hash
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Lien de verification invalide.',
            ], 403);
        }

        // Verifier si deja verifie
        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Cette adresse email est deja verifiee.',
            ]);
        }

        // Marquer comme verifie
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre adresse email a ete verifiee avec succes.',
        ]);
    }

    /**
     * RENVOI DE L'EMAIL DE VERIFICATION
     *
     * Renvoie l'email de verification a l'utilisateur.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $user = User::where('email', $request->input('email'))->firstOrFail();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Cette adresse email est deja verifiee.',
            ]);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Un nouvel email de verification a ete envoye.',
        ]);
    }

    /**
     * NOTICE DE VERIFICATION
     * 
     * Retourne le statut de verification de l'email
     * pour l'utilisateur authentifie.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function verificationNotice(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data'    => [
                'email_verified' => $user->hasVerifiedEmail(),
                'email'          => $user->email,
                'verified_at'    => $user->email_verified_at,
            ],
        ]);
    }
}
